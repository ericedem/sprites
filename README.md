<h2> SpritePacker </h2>

Given a list of NxM images, pack them into one or more 1024x1024 images ("spritesheets"). The algorithm should create the fewest number of spritesheets possible.

Given a list of image sizes in stdin in the following format:
```
864x480 78x107 410x321 188x167 315x274 229x163 629x236 39x32 193x56 543x155
```
You should produce on stdout like the following. Each image line is the dimensions of the image, and then the X and Y coordinate of where it should be placed in the spritesheet:
```
sheet 1
864x480 0 0
410x321 0 480
315x274 410 480
188x167 725 480
229x163 0 801
543x155 229 801
78x107 913 0
193x56 725 647
39x32 913 107

sheet 2
629x236 0 0
```

<h2> Description </h2>

Simple graphical application I wrote to prove to myself that my sprite packing algorithm actually works properly. This is an np-hard problem, so there isn't really a perfect solution that can be found without brute force. This algorithm attempts to find a best fit by searching for open space from left to right. 

NOTE: Performance may suffer dramatically for many small images.

Stack: nodejs, angularjs, svg

<h2> Use </h2>

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

<h2>Future Improvements</h2>

1. Front end should make api call to use sprites API so that the browser can offload computation to server and reuse the same sprites.js file.
2. Allow user to randomly generate a list of NxM values.
2. Write alternative algorithm that takes into account rotation
3. Write alternative algorithm that will attempt to brute force a best fit by randomizing sort order.
