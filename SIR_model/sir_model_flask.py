# -*- coding: utf-8 -*-
"""
Created on Fri Apr 17 10:10:33 2020.

@author: laura
"""

import json
import numpy as np
import pandas as pd
from scipy.integrate import odeint
from flask import Flask, render_template, url_for

app = Flask(__name__)


@app.route("/")



def main():
    def sir_model(y, t, N, beta, gamma):
        S, I, R = y
        dS_dt = -beta * S * I / N
        dI_dt = beta * S * I / N - gamma * I
        dR_dt = gamma * I

        return dS_dt, dI_dt, dR_dt

    # variables
    population = 10000

    initial_infected = 1
    initial_removed = 0
    initial_susceptible = population - initial_infected - initial_removed
    infection_rate = 0.2
    removal_rate = 0.1

    t_max = 365
    t = np.arange(0, t_max + 1)

    initial_conditions = initial_susceptible, initial_infected, initial_removed

    calc = odeint(sir_model, initial_conditions, t,
                  args=(population, infection_rate, removal_rate))

    df = pd.DataFrame(calc, columns=["Susceptible", "Infected", "Removed"])
    df["Days"] = df.index

    # Prepare data for transfer.
    data = df.to_dict(orient='records')
    return render_template("sir_model.html", data=data)
    # return "Hi"


if __name__ == "__main__":
    app.run(debug=True)
