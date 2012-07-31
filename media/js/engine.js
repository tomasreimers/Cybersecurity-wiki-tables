window.DTPrintOptionsList = function (list){
    var toReturn = "";
    for (var i = 0; i < list.length; i++){
        toReturn += "<option value='" + list[i][0].split(" ")[0] + "'>" + list[i][0] + "</option>";
        toReturn += window.DTPrintOptionsList(list[i][1]);
    }
    return toReturn;
}
window.DTGetAffectedTable = function (el){
    return $(el).parents(".dataTableFilterSearchBar").next().children('.datatable')[0];
}
window.DTSearchByAuthorOrTitle = function (el, dontIterate){
    $(window.DTGetAffectedTable(el)).dataTable().fnFilter(el.value);
    if (typeof(dontIterate) === 'undefined'){
        window.DTSearchOther(el, 'search');
    }
}
window.DTSearchChangeCategory = function (el, dontIterate){
    // get actual number
    var catNum = el.value;
    // the all option
    if (catNum == ""){
        $(window.DTGetAffectedTable(el)).dataTable().fnFilter("(.*)", 4, true, false);
        return;
    }
    // encode for regex
    catNum = catNum.replace(/\./g, "\\.");
    catNum = "(^|,)" + catNum;
    // don't include subcategory
    if ($(el).siblings('div').children('input')[0].checked){
        catNum += " ";
    }
    // filter
    $(window.DTGetAffectedTable(el)).dataTable().fnFilter(catNum, 4, true, false);
    if (typeof(dontIterate) === 'undefined'){
        window.DTSearchOther(el, 'category');
    }
}
window.DTSearchChangeType = function (el, dontIterate){
    // Get selected types
    var selectedTypes = "";
    $(el).parent().siblings().andSelf().children("input").filter(function (){
        return this.checked;
    }).each(function (index, el){
        selectedTypes += "(" + el.value + ")|";
    });
    // create regex
    selectedTypes = "^(" + selectedTypes.substring(0, selectedTypes.length - 1) + ")$";
    // filter
    $(window.DTGetAffectedTable(el)).dataTable().fnFilter(selectedTypes, 3, true, false);
    if (typeof(dontIterate) === 'undefined'){
        window.DTSearchOther(el, 'type');
    }
}
// Odd multiple table error if you are filtering on one column, the filter is applied to all all tables but the other tables are not redrawn
// to fix we simply filter the table again
window.DTSearchOther = function (el, alreadyDone){
    var $searchContain = $(el).parents('.dataTableFilterSearchBar');
    if (alreadyDone != 'type'){
        window.DTSearchChangeType($searchContain.find(".dataTableSearchBarType input").first()[0], true);
    }
    if (alreadyDone != 'category'){
        window.DTSearchChangeCategory($searchContain.find(".dataTableSearchBarCategory select").first()[0], true);
    }
    if (alreadyDone != 'search'){
        window.DTSearchByAuthorOrTitle($searchContain.find(".dataTableSearchBarSearch input").first()[0], true);
    }
}
// detect if we need to do anything
$(document).ready(function (){
    if ($(".datatable").length > 0){
        // add table header
        $(".datatable").prepend("<thead></thead>");
        $(".datatable").each(function (index, el){
            $(el).find("th").first().parent().appendTo($(el).find("thead"));
        });
        // convert to datatable
        $(".datatable").dataTable();
        // create custom filter table
        var customFilters = "";
        customFilters += "<div class='dataTableFilterSearchBar'>";
            customFilters += "<div class='dataTableSearchBarType'>";
            customFilters += "<div class='dataTable_filter_header'>Types</div>";
                var types = ["Government Report", "Industry Report", "Independent Report", "Government Hearing", "Book", "Journal Article", "Article"];
                for (var i = 0; i < types.length; i++){
                    customFilters += "<div>";
                        customFilters += "<input type='checkbox' class='typeFilterCheckbox' onchange='window.DTSearchChangeType(this)' checked='checked' value='" + types[i] + "' />";
                        customFilters += "<div>" + types[i] + "</div>";
                    customFilters += "</div>";
                }
            customFilters += "</div>";
            customFilters += "<div class='dataTableSearchBarCategory'>";
            customFilters += "<div class='dataTable_filter_header'>Categories</div>";
                customFilters += "<select class='categoryFilterSelect' onchange='window.DTSearchChangeCategory(this)'>";
                    var categories = [
                        ["1. Overview", []],
                        ["3. Threats and Actors", [
                            ["3.1 The Threats and Skeptics", []],
                            ["3.2 Actors and Incentives", [
                                ["3.2.1 States", []],
                                ["3.2.2 Groups", []],
                                ["3.2.3 Hacktivists", []],
                                ["3.2.4 Terrorists", []],
                                ["3.2.5 Criminals and Criminal Organizations", []]
                            ]],
                            ["3.3 Security Targets", [
                                ["3.3.1 Public Critical Infrastructure", [
                                    ["3.3.1.1 Government Networks (.gov)", []],
                                    ["3.3.1.2 Military Networks (.mil)", []]
                                ]],
                                ["3.3.2 Private Critical Infrastructure", [
                                    ["3.3.2.1 Electricity, Oil and Natural Gas", []],
                                    ["3.3.2.2 Financial Institutions and Networks", []],
                                    ["3.3.2.3 Transportation", []],
                                    ["3.3.2.4 Water, Sewer, etc.", []]
                                ]],
                                ["3.3.3 Communications", [
                                    ["3.3.3.1 Telephone", []],
                                    ["3.3.3.2 Public Data Networks", []],
                                    ["3.3.3.3 Cloud Computing", []]
                                ]]
                            ]]
                        ]],
                        ["4. Issues", [
                            ["4.1 Metrics", []],
                            ["4.2 Economics of Cybersecurity", [
                                ["4.2.1 Risk Management and Investment", []],
                                ["4.2.2 Incentives", []],
                                ["4.2.3 Insurance", []],
                                ["4.2.4 Behavioral Economics", []],
                                ["4.2.5 Market Failure", []]
                            ]],
                            ["4.3 Supply Chain Issues", []],
                            ["4.4 Usability/Human Factors", []],
                            ["4.5 Psychology and Politics", []],
                            ["4.6 Information Sharing/Disclosure", []],
                            ["4.7 Public-Private Cooperation", []],
                            ["4.8 Attribution", []],
                            ["4.9 Identity Management", []],
                            ["4.10 Privacy", []],
                            ["4.11 Cybercrime", []],
                            ["4.12 Cyberwar", []],
                            ["4.13 Espionage", [
                                ["4.13.1 Government to Government", []],
                                ["4.13.2 Industrial", []],
                                ["4.13.3 Media Perceptions", []]
                            ]]
                        ]],
                        ["5. Approaches", [
                            ["5.1 Regulation/Liability", []],
                            ["5.2 Private Efforts/Organizations", []],
                            ["5.3 Government Organizations", []],
                            ["5.4 International Cooperation", []],
                            ["5.5 International Law (including Laws of War)", []],
                            ["5.6 Deterrence", []],
                            ["5.7 Technology", []]
                        ]]
                    ];
                    customFilters += "<option value='' selected='selected'>All</option>";
                    customFilters += window.DTPrintOptionsList(categories);
                customFilters += "</select>";
                customFilters += "<div><input type='checkbox' class='categoryFilterCheckbox' onclick='window.DTSearchChangeCategory($(this).parent().siblings(\"select\")[0])'/><span>Exclude Subcatgeories</span></div>";
            customFilters += "</div>";
            customFilters += "<div class='dataTableSearchBarSearch'>";
                customFilters += "<div class='dataTable_filter_header'>Search</div>";
                customFilters += "<input type='text' onkeyup='window.DTSearchByAuthorOrTitle(this)' class='searchFilterText' placeholder='Title or Author'>";
            customFilters += "</div>";
        customFilters += "</div>";
        // add to every table
        $(".datatable").each(function (index, el){
            $(el).parent().before(customFilters);
        });
        // add all necessary configurations
        $(".datatable").each(function (index, el){
            // get settings holder
            var settingsHolder = $(el).parent().prev()[0];
            // types
            if ($(el).attr('data-type-filter').indexOf("{{{") == -1 && $(el).attr('data-type-filter') != ""){
                // uncheck all
                $(settingsHolder).find(".typeFilterCheckbox").prop('checked', false);
                // check all that were checked
                var checkedTypes = $(el).attr('data-type-filter').split(",");
                for (var i = 0; i < checkedTypes.length; i++){
                    $(settingsHolder).find(".typeFilterCheckbox[value='"+checkedTypes[i]+"']").prop('checked', true);
                }
            }
            // trigger chaneg regardless of if anything happened because otherwise glitch on page with many tables
            $(settingsHolder).find(".typeFilterCheckbox").first().trigger('change');
            // category
            if ($(el).attr('data-category-filter').indexOf("{{{") == -1 && $(el).attr('data-category-filter') != ""){
                var section = $(el).attr('data-category-filter').split(",")[0];
                var excludeChildren =  ($(el).attr('data-category-filter').split(",")[1].toLowerCase() == 'true');
                $(settingsHolder).find(".categoryFilterSelect option[value='"+section+"']").prop('selected', true);
                if (excludeChildren){
                    $(settingsHolder).find(".categoryFilterCheckbox").prop('checked', true);
                }
            }
            $(settingsHolder).find(".categoryFilterSelect").trigger("change");
            // search
            if ($(el).attr('data-search-filter').indexOf("{{{") == -1 && $(el).attr('data-search-filter') != ""){
                $(settingsHolder).find(".searchFilterText")[0].value = $(el).attr('data-search-filter');
            }
            $(settingsHolder).find(".searchFilterText").trigger('keyup');
        });
    }
});