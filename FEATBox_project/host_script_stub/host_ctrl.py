#!/usr/bin/env python3
# host_ctrl.py
#
# dependencies:
#   python 3.6
#   pyusb 1.1.0
#   fabric2 2.5.0
#   libusb-1.0.23
#   paramiko 2.7.2
#   prettytable 2.0.0
#   setuptools 50.3.2
#   setuptools_scm 5.0.1
#   wcwidth 0.2.5

import os
import re
import sys
import json
import subprocess
import usb
import time
import mysql.connector
import datetime

class HostController:
    __wrapperInfo = {
        "version": "1.0",
        "date": "Nov 21, 2020",
        "description": "first version"
    }
    classDir = os.path.dirname(__file__)

    def __init__(self, configFilePath):
        self.configFilePath = configFilePath
        try:
            configFile = open(configFilePath, "r")
        except FileNotFoundError:
            print("ERROR: Config file not found!")
            exit(2)
        self.configData = json.load(configFile)
        configFile.close()

    def featBoxCommand(self, *params, hideOutput=False):
        """
        Connect and run command on FEATBox
        """
        #connect = Connection(**self.configData["connectionConfigure"])
        numberOfParams = len(params)

        #with connect.cd(self.configData["featBoxPath"]):
        if (numberOfParams == 1):
            #log = connect.run("./auto_ctrl.py %s" % params[0])
            print("Run ./auto_ctrl.py %s" % params[0])
        elif (numberOfParams == 2):
            stmAddress = params[0]
            command = params[1]
            #log = connect.run("./auto_ctrl.py %s %s" % (stmAddress, command), hide=hideOutput)
            print("./auto_ctrl.py %s %s" % (stmAddress, command))
        elif (numberOfParams == 3):
            stmAddress = params[0]
            initCommand = params[1]
            boardName = params[2]
            #log = connect.run("./auto_ctrl.py %s %s %s" % (stmAddress, initCommand, boardName))
            print("./auto_ctrl.py %s %s %s" % (stmAddress, initCommand, boardName))
        return 0

    def cpldCommand(self, board, serial, command, cpuType=None, hideOutput=False):
        """
        Call CPLD tool to run a command
        """
        print("Run CPLD command for %s %s: %s" %(board, serial, command))
        return 0

    def updateBoardStatus(self, address, board):
        boardStatus = self.featBoxCommand(address, "status", hideOutput=True)
        return 0

    def getBoardInfo(self, stmAddress="all", attribute="none"):
        """
        Read board information from JSON config data, return a list of board information
        """
        boardList = self.configData["boardList"]
        if stmAddress == "all":
            return boardList
        elif stmAddress not in boardList:
            print("Error: %s is not found!" % stmAddress)
            return None

        if attribute == "none":
            return boardList[stmAddress]

        if boardList[stmAddress]["name"] == "":
            print("Error: The address %s doesn't belong to any board!" % stmAddress)
            return None

        if attribute not in boardList[stmAddress]:
            print("Error: %s is not found in %s!" % (attribute, stmAddress))
            return None

        return boardList[stmAddress][attribute]

    def getCpldInfo(self, board):
        boardName, socName = re.split('_', board)

        if boardName == "starterkit":
            boardName = socName.upper() + "SK"
        else:
            boardName = socName.upper()

        cpldCommandPath = os.path.dirname(os.path.realpath(__file__)) + "/cpld_command.json"
        with open(cpldCommandPath, "r") as json_file:
            boardConfig = json.load(json_file)
        return boardName, boardConfig[boardName]

    def getBoardStatus(self, address=None):
        return 0

    # Print software version, including CPLD tool
    def print_version(self):
        """
        Print the version of this tool and CPLD tool to stdout
        """
        self.featBoxCommand("version")


    def boardControl(self, address, command, cpu=None):
        """
        Function to control board, use for both FEAT Box and CPLD tool.

        return:
        - 0: Success
        - 1: Command not supported
        - 2: Board not found
        """
        # Get the list of available board in config.json
        board = self.getBoardInfo(stmAddress=address)
        if board is None:
            return 2

        if command in ["on", "off", "boot", "unboot"]:
            self.featBoxCommand(address, command)
        elif command in ["reset", "monitor", "uboot"]:
            if board["useCpld"] is False:  # Use FEAT Box
                if cpu is not None:
                    self.featBoxCommand(address, command, cpu)
                else:
                    self.featBoxCommand(address, command)
            else:  # Use CPLD Tool
                self.cpldCommand(board["name"], board["serial"], command, cpuType=cpu)
        elif command == "status":
            self.updateBoardStatus(address, board)
        else:
            return 1

        return 0

    def __boardDictToConfigFile(self, boardDict):
        """
        Convert board dictionary to JSON data and write back to config.json
        """
        configJSONStr = json.dumps(boardDict, indent=4, sort_keys=False)
        config_file = open(self.configFilePath, "w")
        config_file.write(configJSONStr)
        config_file.close()
     
    
def send_database(func, address=None, command=None, cpuOrBoardName=None):
    feat_database_json = os.path.dirname(os.path.realpath(__file__)) + "/feat_database.json"
    with open(feat_database_json, "r") as json_file:
        dataFile = json.load(json_file)

    mydb = mysql.connector.connect(
        database=dataFile["database"],
        host=dataFile["host"],
        # host="localhost",
        user=dataFile["username"],
        password=dataFile["password"],
        port= dataFile["port"]
    )

    mycursor = mydb.cursor()
    farm_id = dataFile["farm_id"]

    if command == "init":  
        def inner1(): 
            status_json = os.path.dirname(os.path.realpath(__file__)) + "/status.json"
            with open(status_json, "r") as json_file:
                init_status = json.load(json_file)

            power_status=init_status[address]["Power"]
            if init_status[address]["Power"] == "on":
                power_status = True
            else:
                power_status = False
            if init_status[address]["Boot"] == "on":
                switch_status = True
            else:
                switch_status = False
            if init_status[address]["Mode"] == "uboot":
                mode_status = True
            else:
                mode_status = False

            boardName = cpuOrBoardName
            ctrl = func(address, command, boardName)
            # farm_id = dataFile["farm_id"]
            if ctrl == 0:
                mycursor.execute("SELECT * FROM boardfarm WHERE farm_id = " + farm_id)
                if len(mycursor.fetchall()) > 0:
                    mycursor.execute("UPDATE boardfarm SET status = 'Available' WHERE farm_id = " + farm_id)
                        
                    mycursor.execute("INSERT INTO board (farm_id, board_i2c_address, board_name, power_status, switch_status, mode_status) VALUES ("+farm_id+", '"+address+"', '"+boardName+"', " + str(power_status) + ", " + str(switch_status) + ", " + str(mode_status) + ")")
                    mydb.commit()
                    print("Sending result to database server")
                # else:
                #     date = str(datetime.date.today())     
                #     mycursor.execute("INSERT INTO boardfarm (host_ip_address, host_user, host_password, status, created_date) VALUES ('"+host+"', '"+user+"', '"+password+"', 'Available', '"+date+"')")

                #     mycursor.execute("SELECT * FROM boardfarm WHERE host_ip_address = '" + host + "' and host_user = '"+ user +"' and host_password = '" + password + "'")
                #     farm_id = mycursor.fetchone()[0] 
                #     mycursor.execute("INSERT INTO board (farm_id, board_i2c_address, board_name, power_status, switch_status, mode_status) VALUES ("+str(farm_id)+",'"+address+"','"+boardName+"', " + str(power_status) + ", " + str(switch_status) + ", " + str(mode_status) + ")")
                #     mydb.commit()
                #     print("Sending result to database server")
            return ctrl   
        return inner1

    elif command == "status":
        def inner2(): 
            boardName = cpuOrBoardName
            ctrl = func(address, command, boardName)
    
            if ctrl == 0:
                mycursor.execute("SELECT * FROM boardfarm WHERE farm_id = " + farm_id)
                if len(mycursor.fetchall()) > 0:
                    mycursor.execute("UPDATE boardfarm SET status = 'Available' WHERE farm_id = " + farm_id)  
                    mydb.commit()
                    print("Sending result to database server")
            else:
                mycursor.execute("SELECT * FROM boardfarm WHERE farm_id = " + farm_id)
                if len(mycursor.fetchall()) > 0:
                    mycursor.execute("UPDATE boardfarm SET status = 'Unavailable' WHERE farm_id = " + farm_id)  
                    mydb.commit()
                    print("Sending result to database server")
            return ctrl
        return inner2

    elif command == "reset":
        def inner3(): 
            status_json = os.path.dirname(os.path.realpath(__file__)) + "/status.json"
            with open(status_json, "r") as json_file:
                init_status = json.load(json_file)

            power_status=init_status[address]["Power"]
            if init_status[address]["Power"] == "on":
                power_status = True
            else:
                power_status = False
            if init_status[address]["Boot"] == "on":
                switch_status = True
            else:
                switch_status = False
            if init_status[address]["Mode"] == "uboot":
                mode_status = True
            else:
                mode_status = False

            boardName = cpuOrBoardName
            ctrl = func(address, command, boardName)
            
            if ctrl == 0:   
                mycursor.execute("SELECT * FROM board WHERE board_i2c_address = '" + address + "' AND farm_id = " + farm_id)
                if len(mycursor.fetchall()) > 0:
                    mycursor.execute("UPDATE board SET power_status = " + str(power_status) + ", switch_status = " + str(switch_status) + ", mode_status = " + str(mode_status) + " WHERE board_i2c_address = '" + address + "' AND farm_id = " + farm_id)
                    
                    command_up = command.upper()
                    mycursor.execute("SELECT board_id FROM board WHERE board_i2c_address = '" + address + "' AND  farm_id = " + farm_id)
                    board_id = str(mycursor.fetchone()[0])
                    
                    date = str(datetime.date.today())
                    time = str(datetime.datetime.now().strftime("%H:%M:%S"))
                    mycursor.execute("INSERT INTO board_log (board_id, date, time, action, status) VALUES ('"+board_id+"','"+date+"','"+time+"','"+command_up+"',True)")
                    mydb.commit()
                    print("Sending result to database server")
            else:
                mycursor.execute("SELECT * FROM board WHERE board_i2c_address = '" + address + "' AND farm_id = " + farm_id)
                if len(mycursor.fetchall()) > 0:
                    command_up = command.upper()
                    mycursor.execute("SELECT board_id FROM board WHERE board_i2c_address = '" + address + "' AND  farm_id = " + farm_id)
                    board_id = str(mycursor.fetchone()[0])
                    
                    date = str(datetime.date.today())
                    time = str(datetime.datetime.now().strftime("%H:%M:%S"))
                    mycursor.execute("INSERT INTO board_log (board_id, date, time, action, status) VALUES ('"+board_id+"','"+date+"','"+time+"','"+command_up+"',False)")
                    mydb.commit()
                    print("Sending result to database server")
            return ctrl   
        return inner3

    else:
        col = ""
        valCol = False
        if command in ["on", "off"]:
            col = "power_status"
            if command == "on":
                valCol = True
            else:
                valCol = False
        elif command in ["boot", "unboot"]:
            col = "switch_status"
            if command == "boot":
                valCol = True
            else:
                valCol = False
        elif command in ["monitor", "uboot"]:
            col = "mode_status"
            if command == "uboot":
                valCol = True
            else:
                valCol = False

        def inner4():
            cpu = cpuOrBoardName
            ctrl = func(address, command, cpu) 
            if ctrl == 0:
                mycursor.execute("SELECT * FROM board WHERE board_i2c_address = '" + address + "' AND farm_id = " + farm_id)
                if len(mycursor.fetchall()) > 0:
                    command_up = command.upper()
    
                    mycursor.execute("UPDATE board SET " + col + " = " + str(valCol) + " WHERE board_i2c_address = '" + address + "' AND farm_id = " + farm_id)
                
                    mycursor.execute("SELECT board_id FROM board WHERE board_i2c_address = '" + address + "' AND  farm_id = " + farm_id)
                    board_id = str(mycursor.fetchone()[0])
                    
                    date = str(datetime.date.today())
                    time = str(datetime.datetime.now().strftime("%H:%M:%S"))
                    mycursor.execute("INSERT INTO board_log (board_id, date, time, action, status) VALUES ('"+board_id+"','"+date+"','"+time+"','"+command_up+"',True)")
                    mydb.commit()
                    print("Sending result to database server")
            else:
                mycursor.execute("SELECT * FROM board WHERE board_i2c_address = '" + address + "' AND farm_id = " + farm_id)
                if len(mycursor.fetchall()) > 0:
                    command_up = command.upper()

                    mycursor.execute("SELECT board_id FROM board WHERE board_i2c_address = '" + address + "' AND  farm_id = " + farm_id)
                    board_id = str(mycursor.fetchone()[0])
                    
                    date = str(datetime.date.today())
                    time = str(datetime.datetime.now().strftime("%H:%M:%S"))
                    mycursor.execute("INSERT INTO board_log (board_id, date, time, action, status) VALUES ('"+board_id+"','"+date+"','"+time+"','"+command_up+"',False)")
                    mydb.commit()
                    print("Sending result to database server")
            return ctrl     
        return inner4 


# --------------------------------------------- Main --------------------------------------------- #
if __name__ == "__main__":
    # Need a full path in case calling this script from other place
    configPath = os.path.dirname(os.path.realpath(__file__)) + "/config.json"

    controller = HostController(configPath)

    # Check the command input
    numberOfArgvs = len(sys.argv)
    command = None
    address = None
    cpu = None

    # Help command
    if numberOfArgvs == 1:
        print("User manual as below:")
        controller.featBoxCommand("help")
        exit(0)
    # Single command
    elif numberOfArgvs == 2:
        command = sys.argv[1]
    # Board control command
    elif numberOfArgvs == 3:
        address = sys.argv[1]
        command = sys.argv[2]
    # change boot master processor
    elif numberOfArgvs == 4:
        address = sys.argv[1]
        command = sys.argv[2]
        cpu = sys.argv[3]
    else:
        print("ERROR: Wrong number of parameters!")
        controller.featBoxCommand("help")
        exit(1)

    # Implement single command: version, checki2c, init
    if address is None:
        print("address is None")
        if command == "version":
            controller.print_version()
            exit(0)
        elif command == "checki2c":
            controller.featBoxCommand("checki2c")
            exit(0)
        elif command == "soft_reset":
            controller.featBoxCommand("FEATBox", command)
            exit(0)
        elif command == "init":
            # Get the list of available board in config.json
            boardList = controller.getBoardInfo()
            for stmAddress in boardList:
                boardName = boardList[stmAddress]["name"]
                if boardName == "":
                    print("Warning: The address %s doesn't belong to any board!" % boardList[stmAddress])
                    continue
                ####
                funcion = send_database(controller.featBoxCommand,stmAddress, "init", boardName)
                funcion()
                # controller.featBoxCommand(stmAddress, "init", boardName)
                ####
            exit(0)
        elif command == "status":
            boardList = controller.getBoardInfo()
            for stmAddress in boardList:
                boardName = boardList[stmAddress]["name"]
                if boardName == "":
                    continue
                ####
                funcWrap = send_database(controller.boardControl, stmAddress, command)
                funcWrap()
                # ret = controller.boardControl(stmAddress, command)
                ####
                time.sleep(0.5)
            controller.getBoardStatus()
            exit(0)
        else:
            print("ERROR: Wrong parameters!")
            controller.featBoxCommand("help")
            exit(1)

    # Implement board control command with board address parameter
    else:  # address is not empty
        if command == "init":
            boardName = controller.getBoardInfo(address, "name")
            if boardName == "":
                print("ERROR: The address %s doesn't belong to any board!" % address)
                exit(1)
            ####
            funcWrap = send_database(controller.featBoxCommand, address, "init", boardName)
            funcWrap()
            # controller.featBoxCommand(address, "init", boardName)
            ####
            exit(0)
        else:
            ####
            funcWrap = send_database(controller.boardControl, address, command, cpu)
            ret = funcWrap()
            # ret=controller.boardControl(address, command, cpu)
            ####
            if command == "status":
                controller.getBoardStatus(address)
            if ret == 0:
                exit(0)

        print("ERROR: Wrong command!")
        controller.featBoxCommand("help")
        exit(1)
