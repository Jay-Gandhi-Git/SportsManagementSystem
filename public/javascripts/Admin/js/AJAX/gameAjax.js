$(document).ready(function () {

    // alert('Hii');
    $("#menu1").children().removeClass("active");
    $("#menu1").children("#liGame").addClass("active");
    var id = 0;
    getAllGameData();

    function removeAllLabelValue() {
        $('#lblErrorForName').text("");
        $('#GameName').css("border-color", "");

        $('#lblError').text("");
        $('#lblErrorForDescription').text("");
        $('#gameDescription').css("border-color", "");
    }

    function removeAllInputValues() {
        $('#gameDescription').val("");
        $('#gameType').val(1);
        $('#gameTeamType').val(1);
        $('#GameName').val("");
        id = 0;
    }

    function getAllGameData() {
        $.ajax({
            url: 'http://localhost:3000/gameGetAjax',
            cache: false,
            method: "post",
            before: function () {
                $('#loading').show();
            },
            success: function (data) {
                if (data.success && data.flag == 0 && data.msg != null) {
                    alert("MSG: " + data.msg);
                }
                else if (data.success && data.flag == 1 && data.msg != null) {
                    $('#tblData tbody').empty();
                    var rows = data.msg;
                    for (var i = 0; i < rows.length; i++) {
                        var row = rows[i];
                        var type = "";
                        var gameTeamType = "";
                        if (row.gameType) {
                            type = "Indoor";
                        }
                        else {
                            type = "Outdoor"
                        }
                        if (row.gameTeamType) {
                            gameTeamType = "Team"
                        } else {
                            gameTeamType = "Single";
                        }
                        $('#tblData tbody').append('<tr><td style="text-align: center"><input type="checkbox" name="post[]" value=' + i + 1 + '></td>' +
                            '<td style="text-align: center">' + row.gameName + '</td><td style="text-align: center">' + row.gameDescription + '</td>' +
                            '<td style="text-align: center">' + type + '</td>' +
                            '<td style="text-align: center">' + gameTeamType + '</td>' +
                            '<td style="text-align: center">\n' +
                            '<a  class="updateClass" value="' + row._id + '" data-toggle="modal" href="#gameForm">' +
                            '<i class="fa fa-pencil fa-lg text-success" aria-hidden="true"></i>' +
                            '</a> | ' +
                            '<a href="#" class="deleteClass" value="' + row._id + '">' +
                            '<i class="fa fa-trash fa-lg text-danger" aria-hidden="true"></i>' +
                            '</a>' +
                            '</td></tr>');
                        // alert('data : '+(i+1)+' is inserted');
                    }
                }

                //alert("Success:Id "+data.sessionData);

            },
            complete: function (data) {
                $('#loading').hide();
            },
            error: function (data) {
                // alert("Error in data : ");
                swal("Oops!", "Error!", "error");
            }
        });
    }

    $(document).on('click', '#callingModalForm', function (e) {
        e.preventDefault();
        removeAllLabelValue();
        removeAllInputValues();
    });
    $(document).on('click', '#btnFormModal', function (e) {
        e.preventDefault();
        removeAllLabelValue();
    });
    $(document).on('click', '#modalButton', function (e) {

        removeAllLabelValue();
        e.preventDefault();
        var buttonValue = $('#modalButton').text();
        var name = document.getElementById("GameName");
        name = name.value;
        var description = document.getElementById("gameDescription");
        description = description.value;
        var type = document.getElementById("gameType");
        type = type.value;
        var gameTeamType = document.getElementById("gameTeamType");
        gameTeamType = gameTeamType.value;
        // alert('hi');
        if (name.length === 0 || description.length === 0) {
            if (name.length === 0 && description.length === 0) {
                $('#GameName').css("border-color", "red");
                $('#lblErrorForName').text('Game name is mendetory');
                $('#gameDescription').css("border-color", "red");
                $('#lblErrorForDescription').text('Game description is mendetory');
            }
            else if (name.length === 0 && description.length !== 0) {
                $('#GameName').css("border-color", "red");
                $('#lblErrorForName').text('Game name is mendetory');
            }
            else if (name.length !== 0 && description.length === 0) {
                $('#instituteEmail').css("border-color", "red");
                $('#gameDescription').text('Game description is mendetory');
            }

        }
        else {
            if (buttonValue == "Save") {
                var data = {name: name, description: description, type: type, gameTeamType: gameTeamType};
                $.ajax({
                    url: 'http://localhost:3000/gameAddAjax',
                    cache: false,
                    data: data,
                    method: 'post',
                    success: function (data) {
                        if (data.success && data.msg != null) {
                            // alert("MSG: " + data.msg);
                            $('#lblError').text(data.msg + " !!");
                        }
                        else if (data.success && data.msg == null) {
                            // window.location.replace('/dashboard');
                            // alert('Success');
                            swal.fire({
                                position: 'center',
                                type: 'success',
                                title: 'Your work has been saved',
                                showConfirmButton: false,
                                timer: 1500
                            });
                            // swal({
                            //     title: "Good job!",
                            //     text: "Game added successfully!",
                            //     icon: "success",
                            //     button: "Ok!",
                            // });
                            $('#gameForm').modal('hide');
                            getAllGameData();
                        }
                    },
                    error: function (data) {
                        // alert("Error in data : " + data.msg);
                        swal("Oops!", "Error!"+ data.msg, "error");
                    }
                });
            }
            else if (buttonValue == "Update") {
                $.ajax({
                    url: "http://localhost:3000/gameUpdateAjax",
                    cache: false,
                    method: "post",
                    data: {id: id, name: name, description: description, type: type, gameTeamType: gameTeamType},
                    success: function (data) {
                        if (data.success && data.msg != null) {
                            // alert("MSG: " + data.msg);
                            $('#lblError').text(data.msg + " !!");
                            id = 0;
                        }
                        else if (data.success && data.msg == null) {
                            // window.location.replace('/dashboard');
                            // alert('Success');
                            swal({
                                title: "Good job!",
                                text: "Game added successfully!",
                                icon: "success",
                                button: "Ok!",
                            });
                            $('#myModalLabel').val('Add your Institute here');
                            $('#gameForm').modal('hide');
                            getAllGameData();
                            removeAllLabelValue();
                            id = 0;
                        }
                        //alert("Success:Id "+data.sessionData);

                    },
                    error: function (data) {
                        // alert("Error in data : " + data.msg);
                        swal("Oops!", "Error!"+data.msg, "error");
                    }
                });
            }
        }
    });

    $(document).on('click', '.updateClass', function (e) {
        e.preventDefault();
        id = $(this).attr('value');
        // alert(id);
        // $('#institueForm').modal('show');
        $("#modalButton").html('Update');

        $('#myModalLabel').val('Update your Game here');
        // alert('Id is : '+id);
        $.ajax({
            url: 'http://localhost:3000/gameGetDataUpdateAjax',
            method: 'POST',
            cache: false,
            data: {id: id},
            success: function (data) {

                $('#GameName').val(data.msg.gameName);
                $('#gameDescription').val(data.msg.gameDescription);
                var type = 0;
                var gameTeamType = 0;
                if (data.msg.gameType) {
                    type = 1;
                }
                if (data.msg.gameTeamType) {
                    gameTeamType = 1;
                }
                $('#gameTeamType').val(gameTeamType);
                $('#gameType').val(type);
            },
            error: function (data) {
                alert(data.msg);
            }
        });
    });
    $(document).on('click', '.deleteClass', function (e) {
        e.preventDefault();
        id = $(this).attr('value');
        // alert("Id is : "+id);
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this game!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    $.ajax({
                        url: 'http://localhost:3000/gameDeleteSingleAjax',
                        method: 'post',
                        cache: false,
                        data: {id: id},
                        success: function (data) {
                            // alert("->" + data.msg);
                            swal("Your record has been deleted!", {
                                icon: "success",
                            });

                            id = 0;
                            getAllGameData();
                        },
                        error: function (data) {
                            // alert(data.msg);
                            swal("Oops!", "Error!"+data.msg, "error");
                        }
                    });

                } else {
                    swal("Your record is safe!");
                }
            });

    });
});