  // set up text to print, each item in array is new line
    var aText = new Array(
                        "Probando writing style",
                        ";)"
                        );
    var iSpeed = 100; // time delay of print out
    var iIndex = 0; // start printing array at this posision
    var iArrLength = aText[0].length; // the length of the text array
    var iScrollAt = 20; // start scrolling up at this many lines
    
    var iTextPos = 0; // initialise text position
    var sContents = ''; // initialise contents variable
    var iRow; // initialise current row
    var first_type = true

    function typewriter(channel="general")
    {
        if (first_type)
        {
            var destination = document.createElement("DIV");
            destination.className = 'shushu';
            destination.id = "shushu";
            document.getElementById('msg-' + channel).appendChild(destination);
            first_type = false;
        }
        
        var destination = document.getElementById('shushu');
        sContents =  ' ';
        iRow = Math.max(0, iIndex-iScrollAt);
        
        while ( iRow < iIndex ) 
        {
            sContents += aText[iRow++] + '<br />';
        }
        destination.innerHTML = sContents + aText[iIndex].substring(0, iTextPos) + "_";
        if ( iTextPos++ == iArrLength ) 
        {
            iTextPos = 0;
            iIndex++;
            if ( iIndex != aText.length ) 
            {
                iArrLength = aText[iIndex].length;
                setTimeout(typewriter, 500);
            }
        } 
        else 
            {
            setTimeout(typewriter, iSpeed);
            }
    }