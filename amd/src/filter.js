/**
 * Block "course overview (campus)" - JS code for filtering courses
 *
 * @package    block_course_overview_campus
 * @copyright  2013 Alexander Bias, Ulm University <alexander.bias@uni-ulm.de>
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/* This comment is just there to keep grunt satisfied and won't be processed at runtime */
/* global define, M */

define(['jquery'], function ($) {
    "use strict";

    function filterTerm(e) {
        // Prevent the event from refreshing the page.
        if (e !== undefined) {
            e.preventDefault();
        }

        var value = $('#coc-filterterm').val();
        if (value === "all") {
            $('.termdiv').removeClass('coc-hidden');
        } else {
            $('.termdiv').addClass('coc-hidden');
            $('.coc-term-' + value).removeClass('coc-hidden');
        }

        // Store the users selection (Uses AJAX to save to the database).
        M.util.set_user_preference('block_course_overview_campus-selectedterm', value);
    }

    function filterTeacher(e) {
        // Prevent the event from refreshing the page.
        if (e !== undefined) {
            e.preventDefault();
        }

        var value = $("#coc-filterteacher").val();
        if (value === "all") {
            $('.teacherdiv').removeClass('coc-hidden');
        } else {
            $('.teacherdiv').addClass('coc-hidden');
            $('.coc-teacher-' + value).removeClass('coc-hidden');
        }

        // Store the users selection (Uses AJAX to save to the database).
        M.util.set_user_preference('block_course_overview_campus-selectedteacher', value);
    }

    function filterCategory(e) {
        // Prevent the event from refreshing the page.
        if (e !== undefined) {
            e.preventDefault();
        }

        var value = $("#coc-filtercategory").val();
        if (value === "all") {
            $('.categorydiv').removeClass('coc-hidden');
        } else {
            $('.categorydiv').addClass('coc-hidden');
            $('.coc-category-' + value).removeClass('coc-hidden');
        }

        // Store the users selection (Uses AJAX to save to the database).
        M.util.set_user_preference('block_course_overview_campus-selectedcategory', value);
    }

    function filterTopLevelCategory(e) {
        // Prevent the event from refreshing the page.
        if (e !== undefined) {
            e.preventDefault();
        }

        var value = $("#coc-filtertoplevelcategory").val();
        if (value === "all") {
            $('.toplevelcategorydiv').removeClass('coc-hidden');
        } else {
            $('.toplevelcategorydiv').addClass('coc-hidden');
            $('.coc-toplevelcategory-' + value).removeClass('coc-hidden');
        }

        // Store the users selection (Uses AJAX to save to the database).
        M.util.set_user_preference('block_course_overview_campus-selectedtoplevelcategory', value);
    }

    function applyAllFilters(initialSettings) {
        var setting, value, $element, elementValue;
        for (setting in initialSettings) {
            if (initialSettings.hasOwnProperty(setting)) {
                value = initialSettings[setting];
                $element = $('#coc-filter' + setting);
                if ($element.length) {
                    elementValue = $element.val();
                    if (elementValue !== value) {
                        switch (setting) {
                        case 'term':
                            filterTerm();
                            break;
                        case 'teacher':
                            filterTeacher();
                            break;
                        case 'category':
                            filterCategory();
                            break;
                        case 'toplevelcategory':
                            filterTopLevelCategory();
                            break;
                        }
                    }
                }
            }
        }
    }

    function localBoostCOCRemember() {
        // Get all course nodes which are not shown (= invisible = their height is 0) and store their IDs in an array
        var notshowncourses = new Array();
        $('.coc-course').each(function(index, element) {
            if ($(element).height() == 0) {
                notshowncourses.push(element.id.replace('coc-course-', ''));
            }
        });

        // Convert not shown courses array to JSON
        var jsonstring = JSON.stringify(notshowncourses);

        // Store the current status of not shown courses (Uses AJAX to save to the database).
        M.util.set_user_preference('local_boostcoc-notshowncourses', jsonstring);
    }

    return {
        initFilter: function (params) {
            // Add change listener to filter widgets.
            $('#coc-filterterm').on('change', filterTerm);
            $('#coc-filterteacher').on('change', filterTeacher);
            $('#coc-filtercategory').on('change', filterCategory);
            $('#coc-filtertoplevelcategory').on('change', filterTopLevelCategory);

            // Add change listener to filter widgets for local_boostcoc.
            if (params.local_boostcoc == true) {
                $('#coc-filterterm, #coc-filterteacher, #coc-filtercategory, #coc-filtertoplevelcategory').on('change',
                        localBoostCOCRemember);
            }

            // Make sure any initial filter settings are applied (may be needed if the user
            // has used the browser 'back' button).
            applyAllFilters(params.initialsettings);
        }
    };
});
