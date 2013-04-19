#!/usr/local/bin/node
//SpritePacker
//
//Given a list of NxM images, pack them into one or more 1024x1024 images ("spritesheets"). The algorithm should create the fewest number of spritesheets possible.
//
//    Given a list of image sizes in stdin in the following format:
//
//    864x480 78x107 410x321 188x167 315x274 229x163 629x236 39x32 193x56 543x155
//
//You should produce on stdout like the following. Each image line is the dimensions of the image, and then the X and Y coordinate of where it should be placed in the spritesheet:
//
//    sheet 1
//864x480 0 0
//410x321 0 480
//315x274 410 480
//188x167 725 480
//229x163 0 801
//543x155 229 801
//78x107 913 0
//193x56 725 647
//39x32 913 107
//
//sheet 2
//629x236 0 0
//

module.exports.Rect = Rect;
module.exports.Sheet = Sheet;

/**
 * basic primitive for handling images and empty spaces.
 * @param height
 * @param width
 * @constructor
 */
function Rect(height, width){
    this.height = height;
    this.width = width;
}

/**
 * Sheet is really just a set of rectangles. This gets initialized with
 * a blank rectangle which will furthur be split into smaller chunks.
 * @constructor
 */
function Sheet(){
    var rect = new Rect(1024,1024);
    rect.x = 0;
    rect.y = 0;
    rect.filled = false;
    this.rectangles = []; // keep track of rectangles that have been placed
    this.spaceTable = [[rect]]; // keep track of available / used space in dynamic 2d array
}

/**
 * This is the meat of the algorithm, this decides how to fit the largest area
 * of rectangles into itself.
 * @param rectList
 */
Sheet.prototype.insertImages = function(rectList){
    var self = this, unPlaced = [];

    // we want to have some order, placing by height
    rectList.sort(function(a,b){return b.height - a.height;});

    // stupid implementation, just keep trying to fit next biggest thing into
    // list of available rectangles. (this can be improved by combining the space held
    // by available rectangles)
    rectList.forEach(function(image){
        var result = self.insertImage(image);
        if (result === false){
            // couldn't place image, save it for next sheet
            unPlaced.push(image);
        }
    });

    return unPlaced;
}

/**
 * Responsible for maintaining list of spaces, as well as figuring out
 * where an item can be placed.
 */
Sheet.prototype.insertImage = function(rect){
    //console.log(this.spaceTable);
    var i, j, result, space, self = this;
    // check from left to right, this could be optimized by keeping a separate
    // data structure pointing to available spaces.
    for (j = 0; j < this.spaceTable[0].length; j++){
        for(i = 0; i < this.spaceTable.length; i++){
            result = self.attemptFit(i,j,rect);
            // we managed to actually place the item
            if (result){
                return true;
            }
        }
    }

    return false;
}

Sheet.prototype.splitRow = function(i,height){
    var space, newSpace;

    // no need to split if row is complete
    if (this.spaceTable[i][0].height === height){
        return;
    }

    var row1 = [];
    var row2 = [];
    for (var j = 0; j < this.spaceTable[i].length; j++){
        space = this.spaceTable[i][j];
        newSpace = new Rect(height,space.width);
        newSpace.x = space.x;
        newSpace.y = space.y;
        newSpace.filled = space.filled === true;

        row1.push(newSpace);

        newSpace = new Rect(space.height - height,space.width);
        newSpace.x = space.x;
        newSpace.y = space.y + height;
        newSpace.filled = space.filled === true;

        row2.push(newSpace)
    }

    // replace old row with new rows;
    this.spaceTable.splice(i,1,row1,row2);
}

Sheet.prototype.splitColumn = function(j,width){
    var space, newSpace1, newSpace2;

    // no need to split if column is filled completely
    if (this.spaceTable[0][j].width === width){
        return;
    }

    for (var i = 0; i < this.spaceTable.length; i++){
        space = this.spaceTable[i][j];
        newSpace1 = new Rect(space.height, width);
        newSpace1.x = space.x;
        newSpace1.y = space.y;
        newSpace1.filled = space.filled === true;

        newSpace2 = new Rect(space.height, space.width - width);
        newSpace2.x = space.x + width;
        newSpace2.y = space.y;
        newSpace2.filled = space.filled === true;

        this.spaceTable[i].splice(j,1,newSpace1,newSpace2);
    }
}

/**
 * if some combination of spaces can be combined to fit the given rectangle at the
 * index point, return an array with the number of indexes that must be combined in
 * [ x , y ]. If the rectangle can't be fitted, return null;
 */
Sheet.prototype.attemptFit = function(init_i,init_j,rect){
    // TODO: make this better and actually check things around it, dummy.
    var height, width, rightSpace, downSpace, i, j,
        space = this.spaceTable[init_i][init_j];

    if (space.filled) {
        return null;
    }


    // see if space is open bellow
    height = rect.height;
    downSpace = space;

    i = init_i;
    while(height > downSpace.height) {
        i++;
        // overflow
        if (i >= this.spaceTable.length){
            return null;
        }
        height -= downSpace.height;
        downSpace = this.spaceTable[i][init_j];
    }

    // see if space is open to the right
    width = rect.width;
    rightSpace = space;

    j = init_j;
    while(width > rightSpace.width) {
        j++;
        if (j >= this.spaceTable[0].length){
            return null;
        }
        width -= rightSpace.width;
        rightSpace = this.spaceTable[init_i][j];
    }

    // now that we have geometry, should check availability
    // TODO: this is expensive to do if we have a heavily subdivided spaceTable
    for (var n = init_i; n <= i; n++){
        for (var m = init_j; m <= j; m++){
            if (this.spaceTable[n][m].filled){
                return null;
            }
        }
    }

    // At this point we know we can place the rectangle.
    rect = new Rect(rect.height, rect.width);
    rect.x = space.x;
    rect.y = space.y;

    this.rectangles.push(rect);

    this.splitRow(i,height);
    this.splitColumn(j,width);

    // now mark everybody as filled
    for (var n = init_i; n <= i; n++){
        for (var m = init_j; m <= j; m++){
            this.spaceTable[n][m].filled = true;
        }
    }

    return true;
}

Sheet.prototype.printSheet = function(){
    console.log("efficiency: " + this.getEfficiency());
    this.rectangles.forEach(function(rect){
        console.log(rect.height + 'x' + rect.width + ' ' + rect.x + ' ' + rect.y);
    });
}

Sheet.prototype.getEfficiency = function (){
    var volume = 0;

    this.rectangles.forEach(function(rectangle){
        volume += rectangle.width * rectangle.height;
    });

    return volume/1024/1024;
}

