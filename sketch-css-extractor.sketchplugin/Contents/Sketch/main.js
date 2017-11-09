function alert(title, message){
	var app = [NSApplication sharedApplication];
	[app displayDialog:message withTitle:title];
}

var extractCSS = function(context) {
    var doc = context.document;

    // initialize data object
    var data = "";

    //allow text to be written to the folder
    var fileTypes = [NSArray arrayWithObjects:@"css", nil];
    
    //create select folder window
    var panel = [NSOpenPanel openPanel];
    [panel setCanChooseDirectories:true];
    [panel setCanCreateDirectories:true];
    [panel setAllowedFileTypes:fileTypes];

    var clicked = [panel runModal];
    //check if Ok has been clicked
    if (clicked == NSFileHandlingPanelOKButton) {

        var isDirectory = true;
    //get the folder path
        var firstURL = [[panel URLs] objectAtIndex:0];
    //format it to a string
        var file_path = [NSString stringWithFormat:@"%@", firstURL];

    //remove the file:// path from string
        if (0 === file_path.indexOf("file://")) {
            file_path = file_path.substring(7);
        }
    }


    var allSymbols = doc.documentData().allSymbols();
    for (var i = 0; i < allSymbols.count(); i++) {
        var currentSymbol = allSymbols[i];data += currentSymbol.name());
        var layers = currentSymbol.layers();
        for (var k = 0; k < layers.count(); k++) {
            data += layers[k].CSSAttributes();
        }
    }

    var data_string = JSON.stringify(data);

    const regex_spaces = new RegExp("\\s+", 'g');
    const regex_new_chars = new RegExp("(\\\\n)", 'g');
    const regex_back_slash = new RegExp("(\\\\)", 'g');
    const regex_quote = new RegExp('\\"', 'g');
    const regex_comma = new RegExp(",", 'g');
    const regex_l_brace = new RegExp("\\(", 'g');
    const regex_r_brace = new RegExp("\\)", 'g');

    var data_text = data_string.replace(regex_new_chars, "");
    data_text = data_text.replace(regex_back_slash, "");
    data_text = data_text.replace(regex_quote, "");
    data_text = data_text.replace(regex_comma, " ");
    data_text = data_text.replace(regex_spaces, "");
    data_text = data_text.replace(regex_l_brace, "{");
    data_text = data_text.replace(regex_r_brace, "};");

    // write to text file
    var t = [NSString stringWithFormat:@"%@", data_text];
    [t writeToFile:file_path+"extract.css" atomically:true encoding:NSUTF8StringEncoding error:null];
};