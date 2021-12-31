# Embody Web Application (Phase 2)

## Description

This is the second phase  of the Embody Web Application, a project I am building for Dr. Mateo Leganes-Fonteneau as part of his studies relating alcohol abuse and bodily sensations (where a hungover person feels a region of "activation" or "deactivation). 

The goal of this web application is to facilitate a seamless and efficienct way of collecting these bodily sensation once the person is hungover. In order to collect these sensations, we needed the 170 participants, each of which will have numerous bodily sensation maps, to be able to enter their data through their phones. Once we have collected all bodily sensation maps from each of the 170 participants, the web application must send a report of all coordinates to my professor, an image of their bodily sensation map, and a collective heatmap that showcases the regions of activation and deactivation across all participants of the study. This "collective heatmap" is constructed through a separate MATLAB script and is hosted on an AWS EC2 instance. The instance is fired once all participants have entered their data, and immediately emails the heatmap to my professor.

This project was built using the MongoDB, Express, Node, and React web stack. The mobile application is primarily being hosted on Heroku. The MATLAB script is being hosted on a separate AWS EC2 instance, and lastly we have used a AWS S3 Bucket to store the participants' individual bodily map for quality control purposes.
