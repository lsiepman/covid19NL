# Spread of COVID-19 in The Netherlands
In this repository, the spread of _confirmed_ COVID-19 cases will be explored.
I am aware that the data is not complete. Due to a shortage of testkits, many COVID-19 patients cannot get tested and the number of confirmed cases is a severe underestimation of reality. However, it is the best data available.

## Sources
All data on confirmed COVID-19 cases was taken from the Rijksinstituut voor Volksgezondheid en Milieu ([RIVM](rivm.nl)). The RIVM published its infection data in csv format at 14.00 hours from 3 March 2020 to 30 March 2020. I reconstructed the data from 27 February 2020 to 2 March 2020 with the news archive of the [NOS](https://nos.nl). It is possible that the dataset in this repository contains errors due to a correction published after the data was downloaded.

The RIVM changed its daily publishing format to the number of hospitalisations per municipality on 31 March. Therefore, the infections dataset ends on 30 March. No other data was taken into account. For the most recent data, I refer you to the [RIVM](rivm.nl).

The overview of [Dutch Municipalities](https://www.cbs.nl/nl-nl/onze-diensten/methoden/classificaties/overig/gemeentelijke-indelingen-per-jaar/indeling%20per%20jaar/gemeentelijke-indeling-op-1-januari-2020) was taken from the Centraal Bureau voor de Statistiek ([CBS](cbs.nl)).

## Usage
In order to view the the interactive maps, it is necessary to use a (local host) server. Examples of the finished graphs can be found in the *Examples* folder.

## SIR model
The SIR model folder contains a flask app that illustrates the SIR model in an interactive way. More information can be found in *SIR_model.md*