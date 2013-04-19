Simple graphical application I wrote to prove to myself that my sprite packing algorithm actually works properly. This is an np-hard problem, so there isn't really a perfect solution that can be found without brute force. This algorithm attempts to find a best fit by searching for open space from left to right. 

NOTE: Performance may suffer dramatically for many small images.

Stack: nodejs, angularjs, svg

<h2> Use <h2>

To Use Webserver:
```
npm install
node app.js
```
To run from the command line:

```
./run [arg1] [arg2] ... [argn]
```
Example:
```
./run 864x480 78x107 410x321 188x167 315x274 229x163 629x236 39x32 193x56 543x155
```
Will output:

```
sheet 0
efficiency: 0.7846488952636719
864x480 0 0
629x236 480 0
543x155 716 0
315x274 480 629
229x163 754 543
193x56 754 772
188x167 810 772
78x107 0 864
39x32 0 942

sheet 1
efficiency: 0.12551307678222656
410x321 0 0
```

This outputs the list of sheets, along with positions of each image size. Note that efficiency is the total area taken up by the images in the sheet, divided by the area of the whole sheet. This gives a reasonable metric for seeing how well the fit was performed.


