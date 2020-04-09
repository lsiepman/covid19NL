# -*- coding: utf-8 -*-
"""
Created on Thu Mar 19 10:25:42 2020.

@author: laura
"""

import os
import re

os.chdir("../Infections")
files = os.listdir()

new_names = []
for i in files:
    date = re.search(r"\d{8}", i).group()
    new_names.append(f"infections_{date}.csv")

for i, _ in enumerate(files):
    os.rename(files[i], new_names[i])