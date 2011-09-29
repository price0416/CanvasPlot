$(function () {
    $('#tabs').tabs({ selected: 0 });
    $("pre[xt='sample']").toggle();
    SyntaxHighlighter.all()
});
function toggleSample(object, sender) {
    object.toggle();
    sender.html((sender.html() == 'show sample' ? 'hide sample' : 'show sample'));
}


function searchSample() {
    alert('Item Value 1 had a search result of : ' + $('#pretty_select').sexyselect('searchItem', 'Value 1'));
}
function tryValidSample() {
    alert('The validation has returned with the result of : ' + $('#pretty_select').sexyselect('validateSize'));
}

function tryTotalItems() {
    alert('The total amount of items is : ' + $('#pretty_select').sexyselect('totalItems'));
}

function selectValue2() {
    var setValue = 'Value 2';
    var checkIt = true;
    $('#pretty_select3').children('option').each(function (idx, item) {
        if ($(this).html() == setValue) {
            if (checkIt)
                $(this).attr('selected', 'selected');
            else
                $(this).removeAttr('selected');
            return;
        }

    });
    $('#pretty_select3').sexyselect('destroy');
    $('#pretty_select3').sexyselect({ title: 'Advanced Title', onItemSelected: function (element, options) {
        alert('Element Selected : ' + element.val() + ' is Checked?' + element.attr('checked'));
    }, autoSort: false, allowInput: true, allowDebug: true, allowCollapse: false, selectionMode: 'multiple'
    });
}

function selectValue() {
    var setValue = 'Value 3';
    var checkIt = true;
    $.each($('#pretty_select3').sexyselect('elements'), function (idx, item) {
        if ($(this).html() == setValue) {
            $('#pretty_select3').sexyselect('selectOption',$(this), checkIt);
            return;
        }
    });
}

function selectValue3() {
    var setValue = 'Value 3';
    $.each($('#pretty_select3').sexyselect('elements'), function (idx, item) {
        if ($(this).html() == setValue) {
            $('#pretty_select3').sexyselect('selectOption', $(this), ($(this).attr('selected') ? false : true));
            return;
        }
    });

}