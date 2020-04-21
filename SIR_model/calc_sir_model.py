# -*- coding: utf-8 -*-
"""
Created on Mon Apr 20 11:49:34 2020.

@author: laura
"""


def sir_model(y, t, N, beta, gamma):
        S, I, R = y
        dS_dt = -beta * S * I / N
        dI_dt = beta * S * I / N - gamma * I
        dR_dt = gamma * I

        return dS_dt, dI_dt, dR_dt

def home():
    t = np.arange(0, t_max + 1)
    calc = odeint(sir_model, initial_conditions, t,
                  args=(population, infection_rate, removal_rate))

    df = pd.DataFrame(calc, columns=["Susceptible", "Infected", "Removed"])
    df["Days"] = df.index

    # Prepare data for transfer.
    data = df.to_dict(orient='records')
    return render_template("sir_model.html", data=data,
                           population=population)