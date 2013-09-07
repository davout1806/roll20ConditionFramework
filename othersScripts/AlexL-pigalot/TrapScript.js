/*
 *  roll20 User: https://app.roll20.net/users/71687/alex-l
 *  git User:    https://gist.github.com/pigalot
*/
// Called every time the token is changed
on("change:token", function(obj, prev) {
    // Get the current location in px
    var l = obj.get("left");
    var t = obj.get("top");
    // Get last location in px
    var pl = prev.left;
    var pt = prev.top;

    // If last is diferent from current then we have moved
    if(pl != l || pt != t) {
        // Get location in squares (one square is 70 px and the location is from the center)
        l = Math.ceil(l / 70);
        t = Math.ceil(t / 70);

        // Log the location for testing
        log("l = " + l + " , t = " + t);

        // change the 10s to where you want the trap
        if(l == 10 && t == 10) {
            // trap code here
            log("omg trap");
        }
    }
});