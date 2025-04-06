/**
 * Smart CSV Lists Front Office Feature
 *
 * NOTICE OF LICENSE
 *
 * @category Front Office Features
 * @author    Pol Rué
 * @copyright Smart Modules 2014
 * @version 1.0.0
 * @license   One time License
 * Registered Trademark & Property of Smart-Modules.pro
 *
 * **************************************************
 *                           WhatsApp contact             *
 * *               http://www.smart-modules.pro           *
 * *                       V 1.0.0                     *
 * **************************************************
 *
 * Versions:
 * 1.0.0 First release.
*/
$(document).ready(function() {
    // Check if there are vcards for mobile download
    if ($(".vcard_link").length > 0) {
        $(".vcard_link").click(function(e) {
            if (confirm($(this).data('confirm'))) {
                $(this).attr('href',$(this).data('vcard'));
            } else {
                $(this).attr('href',$(this).data('tel'));
            }
        });
    }
});