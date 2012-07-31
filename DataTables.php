<?php

// make sure not trying to direct access
if( !defined( 'MEDIAWIKI' ) ) {
  die( 'Not an entry point.' );
}

// credits
$wgExtensionCredits['other'][] = array(
   'path' => __FILE__,
   'name' => 'Data Tables',
   'description' => 'This extension adds filterable datatables where needed.',
   'version'  => 0.1
);

// add the js
$wgResourceModules['ext.DataTables'] = array(
    'scripts' => array(
        'js/jquery.dataTables.min.js',
        'js/engine.js'
    ),
    'styles' => array(
        'css/datatables.css',
        'css/jquery.dataTables.css',
        'css/jquery.dataTables_themeroller.css'
    ),
    'localBasePath' => dirname( __FILE__ ) . "/media",
    'remoteExtPath' => 'DataTables/media'
);

function dataTableAddModule(){
    global $wgOut;
    $wgOut->addModules(array('ext.DataTables'));
    return true;
}
$wgHooks['BeforePageDisplay'][] = 'dataTableAddModule';