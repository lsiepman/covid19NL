# -*- coding: utf-8 -*-
"""
Created on Thu Mar 19 11:33:10 2020.

@author: laura
"""


import os
import pandas as pd
from pathlib import Path

os.chdir("..")

# overview of municipalities
gemeenten = pd.read_excel("Gemeenten/Gemeenten alfabetisch 2020.xlsx")
gemeenten = gemeenten[["Gemeentecode", "Gemeentenaam", "Provincienaam",
                       "Lat", "Lon"]]

# all files with infection data, one file per day
infections = {}
files = os.listdir("Besmettingen RIVM")
sep_change = files.index("infections_20200312.csv")
files_comma_sep = files[ :sep_change]
files_semi_sep = files[sep_change: ]

# comma separated
for i in files_comma_sep:
    infections[Path(i).stem] = pd.read_csv(
        os.path.join("Besmettingen RIVM", i))
    infections[Path(i).stem].fillna(0, inplace=True)

# semi-colon separated
for i in files_semi_sep:
    infections[Path(i).stem] = pd.read_csv(
        os.path.join("Besmettingen RIVM", i), sep=";")
    infections[Path(i).stem].fillna(0, inplace=True)

# which days had a comparable inputformat?
in_format1 = ["infections_20200227", "infections_20200228",
              "infections_20200229", "infections_20200301",
              "infections_20200302", "infections_20200306",
              "infections_20200309", "infections_20200310",
              "infections_20200311"]

in_format2 = ["infections_20200303", "infections_20200304",
              "infections_20200305", "infections_20200307",
              "infections_20200308"]

in_format3 = ["infections_20200312", "infections_20200313",
              "infections_20200314", "infections_20200315",
              "infections_20200316"]

in_format0 = [i for i in infections.keys()
              if i not in in_format1
              and i not in in_format2
              and i not in in_format3]


# creating a single file with all data
all_infections = gemeenten.copy()

# creating a dict with all spelling changes
replacements = {"BeekDaelen": "Beekdaelen",
                r"Súdwest Fryslân": r"Súdwest-Fryslân",
                "Bergen (NH)": "Bergen (NH.)",
                "Bergen (L)": "Bergen (L.)",
                "Hengelo (O)": "Hengelo",
                "s-Gravenhage": "'s-Gravenhage"}

# first input format
for i in in_format1:
    df = infections[i][["id", "Aantal"]]
    all_infections = all_infections.merge(df,
                                          how="left",
                                          left_on="Gemeentecode",
                                          right_on="id")
    all_infections.drop(["id"], axis=1, inplace=True)
    date = i[-8:]
    all_infections.rename(columns={"Aantal": date}, inplace=True)

# second input format
for i in in_format2:
    df = infections[i][["id", "Unnamed: 4"]]
    all_infections = all_infections.merge(df,
                                          how="left",
                                          left_on="Gemeentecode",
                                          right_on="id")
    all_infections.drop(["id"], axis=1, inplace=True)
    date = i[-8:]
    all_infections.rename(columns={"Unnamed: 4": date}, inplace=True)


# third input format
for i in in_format3:
    df = infections[i].replace(replacements)
    all_infections = all_infections.merge(df,
                                          how="left",
                                          left_on="Gemeentenaam",
                                          right_on="Category")
    all_infections.drop(["Category"], axis=1, inplace=True)
    date = i[-8:]
    all_infections.rename(columns={"Aantal": date}, inplace=True)


# other input format
for i in in_format0:
    df = infections[i][["Category", "Aantal"]].replace(replacements)
    all_infections = all_infections.merge(df,
                                          how="left",
                                          left_on="Gemeentenaam",
                                          right_on="Category")
    all_infections.drop(["Category"], axis=1, inplace=True)
    date = i[-8:]
    all_infections.rename(columns={"Aantal": date}, inplace=True)

# sort columns
col_start = ["Gemeentecode", "Gemeentenaam", "Provincienaam", "Lat", "Lon"]
col_dates = sorted([i for i in all_infections if i not in col_start])

all_infections = all_infections[col_start + col_dates]
# all_infections.set_index(col_start, inplace=True)

all_infections.set_index(col_start, inplace=True)
all_infections.fillna(0, inplace=True)
all_infections = all_infections.astype(int)

df_sum = pd.DataFrame(all_infections.sum(axis=0)).reset_index()
df_sum.columns = ["Datum", "Aantal"]

# all_infections = all_infections.pivot_table(index=col_start,
#                                             margins=True,
#                                             margins_name="NL Totaal",
#                                             aggfunc=sum)

all_infections.to_csv("Corona_NL_in_time.csv")
df_sum.to_csv("Daily_sum_infections.csv", index=False)
