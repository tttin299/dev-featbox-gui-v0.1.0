# import mysql.connector


# mydb = mysql.connector.connect(
#   database="db_featweb",
#   host="localhost",
#   user="root",
#   password="",
#   port= "3306"
# )

# mycursor = mydb.cursor()

# mycursor.execute("SELECT * FROM boardfarm")


# x = mycursor.fetchall()[0][0]
# print(x) 

# defining a decorator 
def hello_decorator(func,i): 
    
    # inner1 is a Wrapper function in  
    # which the argument is called 
        
    # inner function can access the outer local 
    # functions like in this case "func" 
    def inner1(): 
        print("Hello, this is before function execution") 
    
        # calling the actual function now 
        # inside the wrapper function. 
        func(i) 
    
        print("This is after function execution") 
            
    return inner1 
    
    
# defining a function, to be called inside wrapper 
def function_to_be_used(i): 
    print(i) 
    print("This is inside the function !!") 
    
    
# passing 'function_to_be_used' inside the 
# decorator to control its behavior 
function_to_be_used = hello_decorator(function_to_be_used,"1") 
    
    
# calling the function 
function_to_be_used() 