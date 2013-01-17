## Developed For

http://cyber.law.harvard.edu/cybersecurity/Main_Page

## Installation

To add this plugin simply link to the extension from your LocalSettings.php:

`require_once( "$IP/extensions/DataTables/DataTables.php" );`

Or something similar.

## Usage

1. Add the following attributes to the table 

`data-type-filter="{{{1}}}" data-category-filter="{{{2}}}" data-search-filter="{{{3}}}"`

2. Create two 1 column tables:

* class='dt_categories'
* class='dt_types'

Which contain a list of categories and types, respectively

3. Remove the class `sortable` from your table and replace with `datatable`

## Documentation

### Prerequisits

* [Wiki markup](https://en.wikipedia.org/wiki/Wiki_markup)
* [Wiki Extensions](https://www.mediawiki.org/wiki/Manual:Extensions)
** [ResourceLoader](https://www.mediawiki.org/wiki/ResourceLoader/Developing_with_ResourceLoader)
* [jQuery](http://jquery.com/)

### The PHP

The PHP is rather straight forward, just basic attribution and loading the necessary JS.

### The CSS

The style was mostly untouched, the custom CSS is used mostly to structure the filter widget.

### The JS

*See the comments.*

The basic logic is:

1. On DOM ready, check if there are any `.datatable`s, and don't do anything if not
2. Get a list of categories and types from user-defined 1 column tables
3. Remove said tables
4. Enable datatables all on tables with class `datatable`
5. Add the filter widget before the table, bind any changes to trigger the filter functions
6. Change all the filter widget options based on the data-attributes configuration, this will trigger the table to update

## Copyright and License

Copyright President and Fellows of Harvard College, 2013

Licensed under the MIT License.