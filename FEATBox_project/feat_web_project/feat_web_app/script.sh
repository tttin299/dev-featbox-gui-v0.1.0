#!/bin/sh

$(pwd)/feat_web_app/plink.exe -ssh $1@$2 -pw $3 -batch $4 > errors.txt 2>&1