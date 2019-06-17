$(document).ready(function () {
    $("#menu1").children().removeClass("active");
    $("#menu1").children("#liGameResult").addClass("active");
    getBindData();
    function getBindData() {
        $.ajax({
            url: 'http://localhost:3000/institute/scheduleGetData',
            method: "POST",
            success: function (data) {
                if (data.success == true && data.msg == "Error while retriving data") {
                    alert(data.msg);
                }
                else if (data.msg == "Session Expired") {
                    window.location.replace('/');
                }
                else {
                    var rows = data.msg;
                    $('#gameName').empty();
                    for (var i = 0; i < rows.length; i++) {
                        var row = rows[i];
                        $('#gameName').append($("<option value='" + row.gameName + "'>" + row.gameName + "</option>"));
                    }
                }
            },
            error: function (data) {
                swal("Oops!", "Error!", "error");
            }
        });
        alert("Hello");
        $.ajax({
            url: 'http://localhost:3000/institute/instituteResultTeamBindAjax',
            method: "POST",
            success: function (data) {
                if (data.success == true && data.msg == "Error while retriving data") {
                    //
                    alert(data.msg);
                }
                else if (data.msg == "Session Expired") {
                    window.location.replace('/');
                }
                else {
                    alert(data);
                    var rows = data.teamNameAry;
                    // alert("Hello 2");
                    // alert("Hello "+data.teamNameAry);
                    $('#teamName').empty();
                    for (var i = 0; i < rows.length; i++) {
                        // var row = rows[i];
                        $('#teamName').append($("<option value='" + rows[i] + "'>" + rows[i] + "</option>"));
                    }
                }
            },
            error: function (data) {
                swal("Oops!", "Error!", "error");
            }
        });

        $.ajax({
            url: 'http://localhost:3000/institute/instituteResultAllDataBindAjax',
            method: "POST",
            success: function (data) {
                if (data.success == true && data.msg == "Error while retriving data") {
                    //
                    alert(data.msg);
                }
                else if (data.msg == "Session Expired") {
                    window.location.replace('/');
                }
                else {
                    alert(data);
                }
            },
            error: function (data) {
                swal("Oops!", "Error!", "error");
            }
        });
    }

    $(document).on('click', '#modalButton', function (e) {
        e.preventDefault();
        var buttonValue = $('#modalButton').text();
        var gameName=document.getElementById('gameName');
        gameName=gameName.value;
        var gender=document.getElementById('gender');
        gender=gender.value;
        var teamName=document.getElementById('teamName');
        teamName=teamName.value;
        var resultType=document.getElementById('resultType');
        resultType=resultType.value;

        if (buttonValue == "Save") {

            alert('cliked');

            $.ajax({
                url: 'http://localhost:3000/institute/instituteResultTeamAddAjax',
                cache: false,
                data: {gameName:gameName,gender:gender,resultType:resultType,teamName:teamName},
                method: 'post',
                success: function (data) {
                    // alert(data);
                    if(data.msg==="Session Expired")
                    {
                        window.location.replace('/');
                    }
                    else if(data.success && data.msg==="Successfully result created")
                    {
                        swal({
                            title: "Good job!",
                            text: "Successfully result created",
                            icon: "success",
                            button: "Ok!",
                        });
                        $('#scheduleForm').modal('hide');
                    }
                    else if(data.success && data.msg==="Failed to create the result")
                    {
                        swal("Oops!", "Error! Failed to create the result", "error");
                    }
                },
                error: function (data) {
                    // alert("Error in data : ");
                    swal("Oops!", "Error!"+data.msg, "error");
                }
            });
        }
        else if (buttonValue == "Update") {

        }
    });

});