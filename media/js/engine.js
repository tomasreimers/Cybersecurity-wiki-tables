/*
 * Returns the table that a form field in the filter tool will affect
 *
 * el - the form element
 */
window.DTGetAffectedTable = function (el){
    return $(el).parents(".DTFilterSearchBar").next().children('.datatable')[0];
}
/*
 * The backend to free text search
 *
 * el - the search bar
 * dontIterate - Whether the other fields have to be searched
 */
window.DTSearchByAuthorOrTitle = function (el, dontIterate){
    $(window.DTGetAffectedTable(el)).dataTable().fnFilter(el.value);
    if (typeof(dontIterate) === 'undefined'){
        window.DTSearchOther(el, 'search');
    }
}
/*
 * Changes the category
 *
 * el - the drop down selection menu
 * dontInterate - Whether or not the other fields have to be searched
 */
window.DTSearchChangeCategory = function (el, dontIterate){
    // get actual number of the category
    var catNum = el.value;
    // if 'all' is selected remove any filter
    if (catNum == ""){
        $(window.DTGetAffectedTable(el)).dataTable().fnFilter('', 5, true, false);
        return;
    }
    // convert the selection for regex
    catNum = catNum.replace(/\./g, "\\.");
    catNum = "(^|,)" + catNum;
    // check if the don't include subcategories option is checked and act accordingly
    if ($(el).siblings('div').children('input')[0].checked){
        catNum += "\.? "; // \.? because numbers that aren't subcategories have trailing dot (i.e. "1.")
    }
    else {
        catNum += "( |\.)";
    }
    // actually filter
    $(window.DTGetAffectedTable(el)).dataTable().fnFilter(catNum, 5, true, false);
    if (typeof(dontIterate) === 'undefined'){
        window.DTSearchOther(el, 'category');
    }
}
/*
 * Changes the type
 *
 * el - the checkbox
 * dontInterate - Whether or not the other fields have to be searched
 */
window.DTSearchChangeType = function (el, dontIterate){
    // Get selected types
    var selectedTypes = "";
    $(el).parent().siblings().andSelf().children("input").filter(function (){
        return this.checked;
    }).each(function (index, el){
        selectedTypes += "(" + el.value + ")|";
    });
    // create regex
    selectedTypes = "^(" + selectedTypes.substring(0, selectedTypes.length - 1) + ")";
    // filter
    $(window.DTGetAffectedTable(el)).dataTable().fnFilter(selectedTypes, 4, true, false);
    if (typeof(dontIterate) === 'undefined'){
        window.DTSearchOther(el, 'type');
    }
}
/*
 * Searches the other two fields.
 * As I understand, when you filter, datatable actually filters the content and then redraws the table of interest.
 * The problem is that if you have mutliple tables filter will filter ALL the tables and then only redraw one, 
 * normally this wouldn't be a problem, but when you are searchign multiple columns it is.
 * To get around this, we simply must filter a table on every column we are concern about.
 *
 * el - Whatever invoked the other search
 * alreadyDone - what search was already completed
 */
window.DTSearchOther = function (el, alreadyDone){
    var $searchContain = $(el).parents('.DTFilterSearchBar');
    if (alreadyDone != 'type'){
        window.DTSearchChangeType($searchContain.find(".DTSearchBarType input").first()[0], true);
    }
    if (alreadyDone != 'category'){
        window.DTSearchChangeCategory($searchContain.find(".DTSearchBarCategory select").first()[0], true);
    }
    if (alreadyDone != 'search'){
        window.DTSearchByAuthorOrTitle($searchContain.find(".DTSearchBarSearch input").first()[0], true);
    }
}
// init the datatables
$(document).ready(function (){
    // detect if we need to do anything
    if ($(".datatable").length > 0){
        // get categories from user generated table
        var categories = [];
        $("table.dt_categories").first().find("td").each(function (index, el){
            categories.push($(el).html().trim());
        });
        $("table.dt_categories").remove();
        // get types from user generated table
         var types = [];
        $("table.dt_types").first().find("td").each(function (index, el){
            types.push($(el).html().trim());
        });
        $("table.dt_types").remove();
        // add table header, needed because wiki markup doesn't automatically add it
        $(".datatable").prepend("<thead></thead>");
        $(".datatable").each(function (index, el){
            $(el).find("th").first().parent().appendTo($(el).find("thead"));
        });
        // convert to datatable
        $(".datatable").dataTable({
            "aoColumns": [
              { "sWidth": "20%" },
              { "sWidth": "7%" },
              { "sWidth": "32%" },
              { "sWidth": "8%" },
              { "sWidth": "8%" },
              { "sWidth": "25%" }
            ],
            "iDisplayLength": 25
        });
        // create custom filter widget
        var customFilters = "";
        customFilters += "<div class='DTFilterSearchBar'>";
            customFilters += "<div class='DTSearchBarType'>";
            customFilters += "<div class='DTFilterHeader'>Types</div>";
                for (var i = 0; i < types.length; i++){
                    customFilters += "<div>";
                        customFilters += "<input type='checkbox' class='typeFilterCheckbox' onchange='window.DTSearchChangeType(this)' checked='checked' value='" + types[i] + "' />";
                        customFilters += "<div>" + types[i] + "</div>";
                    customFilters += "</div>";
                }
            customFilters += "</div>";
            customFilters += "<div class='DTSearchBarCategory'>";
            customFilters += "<div class='DTFilterHeader'>Categories</div>";
                customFilters += "<select class='categoryFilterSelect' onchange='window.DTSearchChangeCategory(this)'>";
                    customFilters += "<option value='' selected='selected'>All</option>";
                    for (var i = 0; i < categories.length; i++){
                        customFilters += "<option value='" + categories[i].split(" ")[0].replace(/\.$/, "") + "'>" + categories[i] + "</option>"
                    }
                customFilters += "</select>";
                customFilters += "<div><input type='checkbox' class='categoryFilterCheckbox' onclick='window.DTSearchChangeCategory($(this).parent().siblings(\"select\")[0])'/><span>Exclude Subcatgeories</span></div>";
            customFilters += "</div>";
            customFilters += "<div class='DTSearchBarSearch'>";
                customFilters += "<div class='DTFilterHeader'>Search</div>";
                customFilters += "<input type='text' onkeyup='window.DTSearchByAuthorOrTitle(this)' class='searchFilterText' placeholder='Free Text Search'>";
            customFilters += "</div>";
            customFilters += "<a href='http://cyber.law.harvard.edu/cybersecurity/Help#How_to_Use_the_Filter' class='DTSearchBottomLink'>Help</a>"
        customFilters += "</div>";
        // add to every table
        $(".datatable").each(function (index, el){
            $(el).parent().before(customFilters);
        });
        // add all necessary configurations passed to the template
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