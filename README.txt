===== Solution =====
Hi There. I hope you enjoy playing my version of snap!

Where is the slider?
As angular.js didn't have a native slider component I would have had to rely on jQuery/jQuery UI to implement such a control.
This would have been relatively simple to do, but I chose to keep the solution simple and lightweight by using just angular.js as a dependency.
Instead I have implemented a very beautiful(!) radio group which binds elegantly to the model.

===== Assumptions =====
- Data source has correct input of 52 card deck
- If the next card is played before a snap is made, that snap is lost to both players
- There will be a winner. Easy to fix up the logic in case of no winner, but ran out of time for this

===== Next Steps & Improvements =====
A task like this could take a long time to implement to make it fantastic, here are a few feature which would make it killer!
- implement way to cancel a pending snap by computer if player has already moved on
- responsive CSS using media queries so it looks fab across all devices
- multi-player using NodeJS and possibly a touch of SocketIO
- test cases!
- improve UI design (prettify with css3 animations and the like)
- add in a slider control
- move call to json into angular service

===== Run with Node =====
You can run this app with node by performing the following
npm install
node server