
/*
 * Fonction pour l'ajout de commande, appellé automatiquement par plugin.template
 */
function addCmdToTable(_cmd) {
    if (!isset(_cmd)) {
        var _cmd = { configuration: {} };
    }
    if (!isset(_cmd.configuration)) {
        _cmd.configuration = {};
    }
    var tr = '<tr class="cmd" data-cmd_id="' + init(_cmd.id) + '">';
    tr += '<td style="min-width:280px;width:350px;">';
    tr += '<div class="row">';
    tr += '<span class="cmdAttr" data-l1key="id" style="display:none;"></span>';
    tr += '<input class="cmdAttr form-control input-sm" data-l1key="type" style="display : none;">';
    tr += '<input class="cmdAttr form-control input-sm" data-l1key="subType" style="display : none;">';
    tr += '<input class="cmdAttr form-control input-sm" data-l1key="logicalId" style="display : none;">';

    tr += '<div class="col-xs-7">';
    tr += '<input class="cmdAttr form-control input-sm" data-l1key="name" style="width : 200px;" placeholder="{{Nom}}">';
    tr += '</div>';
    tr += '<div class="col-xs-5">';
    tr += '<a class="cmdAction btn btn-default btn-sm" data-l1key="chooseIcon"><i class="fas fa-flag"></i> Icône</a>';
    tr += '<span class="cmdAttr" data-l1key="display" data-l2key="icon" style="margin-left : 10px;"></span>';
    tr += '</div>';
    tr += '</div>';
    tr += '</td>';

    tr += '<td>';
    tr += '</td>';

    tr += '<td style="min-width:100px;width:140px;">';
    tr += '<input class="cmdAttr form-control input-sm" data-l1key="unite" placeholder="Unité" title="{{Unité}}">';
    tr += '<input class="cmdAttr form-control input-sm" data-l1key="configuration" data-l2key="minValue" placeholder="{{Min}}" title="{{Min}}" style="margin-top : 5px;"> ';
    tr += '<input class="cmdAttr form-control input-sm" data-l1key="configuration" data-l2key="maxValue" placeholder="{{Max}}" title="{{Max}}" style="margin-top : 5px;">';
    tr += '</td>';

    tr += '<td style="min-width:100px;width:140px;">';
    tr += '<div><label class="checkbox-inline"><input type="checkbox" class="cmdAttr checkbox-inline" data-l1key="isVisible" checked/>{{Afficher}}</label></div> ';
    tr += '<div><label class="checkbox-inline"><input type="checkbox" class="cmdAttr checkbox-inline" data-l1key="isHistorized" checked/>{{Historiser}}</label></div> ';
    tr += '<div><label class="checkbox-inline"><input type="checkbox" class="cmdAttr checkbox-inline" data-l1key="display" data-l2key="invertBinary"/>{{Inverser}}</label></div>';
    tr += '</td>';

    tr += '<td style="min-width:100px;width:140px;">';
    if (is_numeric(_cmd.id)) {
        tr += '<a class="btn btn-default btn-xs cmdAction" data-action="configure"><i class="fas fa-cogs"></i></a> ';
        tr += '<a class="btn btn-default btn-xs cmdAction" data-action="test"><i class="fas fa-rss"></i> {{Tester}}</a>';
    }
    tr += '<i class="fas fa-minus-circle pull-right cmdAction cursor" data-action="remove"></i>';
    tr += '</td>';
    tr += '</tr>';

    $('#table_cmd tbody').append(tr);
    $('#table_cmd tbody tr:last').setValues(_cmd, '.cmdAttr');
    if (isset(_cmd.type)) {
        $('#table_cmd tbody tr:last .cmdAttr[data-l1key=type]').value(init(_cmd.type));
    }
    jeedom.cmd.changeType($('#table_cmd tbody tr:last'), init(_cmd.subType));
}

$("#table_cmd").sortable({ axis: "y", cursor: "move", items: ".cmd", placeholder: "ui-state-highlight", tolerance: "intersect", forcePlaceholderSize: true });

$('.pluginAction[data-action=openLocation]').on('click', function () {
    window.open($(this).attr("data-location"), "_blank", null);
});

$('#bt_syncmultiMATIC').on('click', function () {
    $.ajax({
        type: "POST",
        url: "plugins/SmartMeterP1/core/ajax/SmartMeterP1.ajax.php",
        data: {
            action: "syncDevices",
        },
        dataType: 'json',
        error: function (request, status, error) {
            handleAjaxError(request, status, error);
        },
        success: function (data) {
            if (data.state != 'ok') {
                $('#div_alert').showAlert({ message: data.result, level: 'danger' });
                return;
            }
            $('#div_alert').showAlert({ message: '{{Synchronisation réussie.}}', level: 'success' });
            setTimeout(function () {
                window.location.replace("index.php?v=d&m=SmartMeterP1&p=SmartMeterP1");
            }, 3000);
        }
    });
});

$('#bt_createCommands').on('click', function () {
    $.ajax({
        type: "POST",
        url: "plugins/SmartMeterP1/core/ajax/SmartMeterP1.ajax.php",
        data: {
            action: "createCommands",
            id: $('.eqLogicAttr[data-l1key=id]').value()
        },
        dataType: 'json',
        error: function (request, status, error) {
            handleAjaxError(request, status, error);
        },
        success: function (data) {
            if (data.state != 'ok') {
                $('#div_alert').showAlert({ message: data.result, level: 'danger' });
                return;
            }
            $('#div_alert').showAlert({ message: '{{Opération réalisée avec succès}}', level: 'success' });
            $('.eqLogicDisplayCard[data-eqLogic_id=' + $('.eqLogicAttr[data-l1key=id]').value() + ']').click();
        }
    });
});

$(".eqLogicAttr[data-l1key='configuration'][data-l2key='type']").change(function () {
    $('#img_device').attr("src", 'core/img/no_image.gif');

    if ($(this).value() != '') {
        $.ajax({
            type: "POST",
            url: "plugins/SmartMeterP1/core/ajax/SmartMeterP1.ajax.php",
            data: {
                action: "getImage",
                id: $('.eqLogicAttr[data-l1key=id]').value()
            },
            dataType: 'json',
            error: function (request, status, error) {
                handleAjaxError(request, status, error);
            },
            success: function (data) {
                if (data.state != 'ok') {
                    return;
                }
                console.log(data)
                $('#img_device').attr("src", data.result);
            }
        })
    }
});