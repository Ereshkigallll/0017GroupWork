# 0017GroupWork

## 1. Introduction

Welcome to RideLink! 

This is a website that will help you find out how many taxis are picking up passengers around you in real time as well as in the upcoming period. Our vision is to be able to help reduce empty taxi rates, reduce unnecessary tailpipe emissions, and protect the only home we have. If you would like to explore our page, feel free to clone our repository and follow the instructions below.

## 2. How to use

First of all, make sure you have the plugin Live Server installed on vscode, which can help you tune your pages locally.

Afterwards, please use the following codes to install `Node.js`, `express` and `cors` first.
```
npm install express mysql cors
```

After cloning our project files locally, there are a few things to keep in mind.

Since our project is being deployed on a server, the heatmap on the website will not be displayed in case of using a local dataset. Therefore you need to prepare a SQL server yourself and fill in the relevant information into the corresponding code in the server.js file in the backend folder.
```
# change to the information of your server
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    port: '3306',
    database: 'ridelink'
  });
```
Please then use the following code to start the service.
```
cd backend
node server.js
```

In addition, the heat map does not appear directly after loading the website, but only after dragging or zooming the map. So don't be surprised when you realise that there is no heat map on the map, try interacting with it!

Please feel free to browse and explore our website!