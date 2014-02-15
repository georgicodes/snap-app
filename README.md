Snap App
=================

## Heroku
This game has been deployed to heroku, please visit: http://agile-reaches-2810.herokuapp.com/ to play

The file containing the game logic is in scripts/controllers.js

## Run with Node
You can run this app with node by performing the following
npm install
node server

## Game Engine Assumptions
- Data source has correct input of 52 card deck
- If the next card is played before a snap is made, that snap is lost to both players
- There will always be a winner

## Next Steps & Improvements
Even a small game like Snap could take a long time to implement to make it fantastic, here are a few feature which would make it killer!

- responsive CSS using media queries so it looks fab across all devices
- multi-player using NodeJS and possibly a touch of SocketIO
- test cases!
- improve UI design (prettify with css3 animations and the like)
- add in a slider control
- move call to json into angular service
