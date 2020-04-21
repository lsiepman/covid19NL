# -*- coding: utf-8 -*-
"""
Created on Fri Apr 17 10:10:33 2020.

@author: laura
"""

import json
import numpy as np
import pandas as pd
from scipy.integrate import odeint
from flask import Flask, render_template, url_for, request, jsonify
import requests

from calc_sir_model import sir_model

# variables
population = 10000

initial_infected = 1
initial_removed = 0
initial_susceptible = population - initial_infected - initial_removed

initial_conditions = initial_susceptible, initial_infected, initial_removed


app = Flask(__name__)


@app.route("/",  methods=["GET"])
def home():
    """Create graph with initial values."""
    t_max = 365
    infection_rate = 0.2
    removal_rate = 0.01

    t = np.arange(0, t_max + 1)
    calc = odeint(sir_model, initial_conditions, t,
                  args=(population, infection_rate, removal_rate))

    df = pd.DataFrame(calc, columns=["Susceptible", "Infected", "Removed"])
    df["Days"] = df.index

    # Prepare data for transfer.
    data = df.to_dict(orient='records')
    return render_template("sir_model.html", data=data,
                           population=population, t_max=t_max,
                           infection_rate=infection_rate,
                           removal_rate=removal_rate)


@app.route('/getvars', methods=["POST"])
def get_vars():
    """Get slider values."""
    data = request.get_json(force=True)
    infection_rate = data["valInfectionRate"]
    removal_rate = data["valRemovalRate"]
    t_max = data["valTMax"]

    t = np.arange(0, t_max + 1)
    calc = odeint(sir_model, initial_conditions, t,
                  args=(population, infection_rate, removal_rate))

    df = pd.DataFrame(calc, columns=["Susceptible", "Infected", "Removed"])
    df["Days"] = df.index

    # Prepare data for transfer.
    new_data = df.to_json(orient='records')
    return new_data


if __name__ == "__main__":
    app.run(debug=False)
