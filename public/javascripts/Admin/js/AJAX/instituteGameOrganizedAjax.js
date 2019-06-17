$(document).ready(function () {


    $("#menu1").children().removeClass("active");
    $("#menu1").children("#liGameOrganize").addClass("active");

    getBindData();
    getAllGameOrganizedData();
    var id = 0;

    function removeAllModelOpen() {
        id = 0;
        $('#SearchEnrollment').val("");
        $('#TeamName').val("");
        var myDDL = $('#gender');
        myDDL[0].selectedIndex = 0;
        var myDDL = $('#year');
        myDDL[0].selectedIndex = 0;
        var myDDL = $('#gameName');
        myDDL[0].selectedIndex = 0;
        $(".chk").each(function () {
                $(this).prop( "checked", false );
        });
        $("#modalButton").html('Save');
    }

    $(document).on('click', '#callingModalForm', function (e) {
        e.preventDefault();
        removeAllModelOpen();
    });

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
                    $('#tblDataForStudent tbody').empty();
                    var rows = data.students;
                    if (rows === null) {

                    }
                    else if (rows !== null) {
                        for (var i = 0; i < rows.length; i++) {
                            var row = rows[i];
                            $('#tblDataForStudent tbody').append('<tr >' +
                                '<td style="text-align: center"><input type="checkbox" name="post[]" class="chk" value=' + row._id + '></td>' +
                                '<td style="text-align: center">' + row.studentName + '</td>' +
                                '<td style="text-align: center">' + row.studentEnrollmentNumber + '</td>' +
                                '<td style="text-align: center">' + row.studentEmail + '</td>' +
                                '</tr>');
                            // alert('data : '+(i+1)+' is inserted');
                        }
                    }
                }
            },
            error: function (data) {
                swal("Oops!", "Error!", "error");
            }
        });
    }


    function getAllGameOrganizedData() {
        $.ajax({
            url: 'http://localhost:3000/institute/instituteGameOrganizeGetAllDataAjax',
            cache: false,
            method: 'post',
            success: function (data) {
                // alert(data);
                if (data.msg === "Session Expired") {
                    window.location.replace('/');
                }
                if (data.success && data.goiIdArray !== null) {
                    alert("Data Came " + data);
                    alert("Goid ni length " + data.goiIdArray.length);
                    $('#tblData tbody').empty();
                    for (var i = 0; i < data.goiIdArray.length; i++) {
                        var row = data.goiIdArray[i];
                        var goID = row[0];
                        var gameId = row[1];
                        var gender = row[2];
                        var year = new Date(row[3]);
                        year = year.getFullYear();
                        var gameName = row[4];
                        var numberOfStudents = row[5];
                        $('#tblData tbody').append('<tr>' +
                            '<td style="text-align: center"><input type="checkbox" name="post[]" value=' + i + 1 + '></td>' +
                            '<td style="text-align: center">' + gameName + '</td>' +
                            '<td style="text-align: center">' + year + '</td>' +
                            '<td style="text-align: center">' + numberOfStudents + '</td>' +
                            '<td style="text-align: center">' + gender + '</td>' +
                            '<td style="text-align: center">\n' +
                            '<a  class="updateClass" value="' + goID + '" data-toggle="modal" href="#gameOrganizeForm">' +
                            '<i class="fa fa-pencil fa-lg text-success" aria-hidden="true"></i>' +
                            '</a> | ' +
                            '<a href="#" class="deleteClass" value="' + goID + '">' +
                            '<i class="fa fa-trash fa-lg text-danger" aria-hidden="true"></i>' +
                            '</a>' +
                            '</td>' +
                            '</tr>');
                        // alert("Game Name "+gameName);
                    }
                }
                // if(data.success && data.studentsIdAry!=null && data.gamesName!=null && data.gameOrganizeYearArray!=null && data.gameOrganizeGenderArray!=null)
                // {
                //     $('#tblData tbody').empty();
                //     var gameRows=data.gamesName;
                //     var yearRows=data.gameOrganizeYearArray;
                //     var genderRows=data.gameOrganizeGenderArray;
                //     var goiIdRows=data.goiIdAry;
                //     for(var i=0;i<gameRows.length;i++)
                //     {
                //
                //         var gameRow = gameRows[i];
                //         // alert('Hello '+i+gameRows[i]+" "+gameRow);
                //         var yearRow = yearRows[i];
                //         var date= new Date(yearRow);
                //         date=date.getFullYear();
                //         // alert('Hi');
                //         var genderRow=genderRows[i];
                //         // alert('Hello '+i+gameRows[i]+" "+gameRow+" "+yearRow+" "+genderRow);
                //         var goiIdRow=goiIdRows[i];
                //         $('#tblData tbody').append('<tr>' +
                //             '<td style="text-align: center"><input type="checkbox" name="post[]" value='+i+1+'></td>' +
                //             '<td style="text-align: center">'+gameRow+'</td>' +
                //             '<td style="text-align: center">'+date+'</td>' +
                //             '<td style="text-align: center">'+'2'+'</td>' +
                //             '<td style="text-align: center">'+genderRow+'</td>' +
                //             '<td style="text-align: center">\n' +
                //             '<a  class="updateClass" value="'+goiIdRow+'" data-toggle="modal" href="#">' +
                //             '<i class="fa fa-pencil fa-lg text-success" aria-hidden="true"></i>' +
                //             '</a> | '+
                //             '<a href="#" class="deleteClass" value="'+goiIdRow+'">' +
                //             '<i class="fa fa-trash fa-lg text-danger" aria-hidden="true"></i>' +
                //             '</a>'+
                //             '</td>' +
                //             '</tr>');
                //     }
                // }
            },
            error: function (data) {
                // alert("Error in data : ");
                swal("Oops!", "Error!" + data.msg, "error");
            }
        });
    }

    $(document).on('click', '#modalButton', function (e) {
        e.preventDefault();
        var TeamName = document.getElementById('TeamName');
        TeamName = TeamName.value;
        var gameName = document.getElementById('gameName');
        gameName = gameName.value;
        var year = document.getElementById('year');
        year = year.value;
        var gender = document.getElementById('gender');
        gender = gender.value;
        var chkArray = [];
        /* look for all checkboes that have a class 'chk' attached to it and check if it was checked */
        $(".chk:checked").each(function () {
            chkArray.push($(this).val());
        });
        /* we join the array separated by the comma */
        var selected;
        selected = chkArray.join(', ');
        var buttonValue = $('#modalButton').text();
        if (buttonValue == "Save") {

            // alert('cliked');

            /* check if there is selected checkboxes, by default the length is 1 as it contains one single comma */
            if (selected.length > 0) {
                // alert("You have selected " + selected);
                $.ajax({
                    url: 'http://localhost:3000/institute/instituteGameOrganiseAddAjax',
                    cache: false,
                    data: {chkArray: chkArray, TeamName: TeamName, GameName: gameName, year: year, gender: gender},
                    method: 'post',
                    success: function (data) {
                        // alert(data);
                        if (data.msg === "Session Expired") {
                            window.location.replace('/');
                        }
                        else if (data.success && data.msg === "Successfully add Game Organize & team & team member") {
                            swal({
                                title: "Good job!",
                                text: "Game Organized successfully with Team and Team member!",
                                icon: "success",
                                button: "Ok!",
                            });
                            $('#gameOrganizeForm').modal('hide');
                            getAllGameOrganizedData();
                            removeAllModelOpen();
                        }
                    },
                    error: function (data) {
                        // alert("Error in data : ");
                        swal("Oops!", "Error!" + data.msg, "error");
                    }
                });
            }
            else {
                swal("Oops!", "Please at least check one of the checkbox!", "error");
            }
        }
        else if (buttonValue == "Update") {
            //update code here
            if (selected.length > 0) {
                $.ajax({
                    url: 'http://localhost:3000/institute/instituteGameOrganizeUpdateAjax',
                    cache: false,
                    data: {id:id,chkArray: chkArray, TeamName: TeamName, GameName: gameName, year: year, gender: gender},
                    method: 'post',
                    success: function (data) {
                        // alert(data);
                        if (data.msg === "Session Expired") {
                            window.location.replace('/');
                        }
                        else if (data.success && data.msg === "Successfully Updated Game Organize & team & team member") {
                            swal({
                                title: "Good job!",
                                text: "Game Organized successfully Updated with Team and Team member!",
                                icon: "success",
                                button: "Ok!",
                            });
                            $('#gameOrganizeForm').modal('hide');
                            getAllGameOrganizedData();
                            removeAllModelOpen();
                        }
                    },
                    error: function (data) {
                        // alert("Error in data : ");
                        swal("Oops!", "Error!" + data.msg, "error");
                    }
                });
            }
            else {
                swal("Oops!", "Please at least check one of the checkbox!", "error");
            }
        }
    });


    $(document).on('click', '.updateClass', function (e) {
        e.preventDefault();
        id = $(this).attr('value');
        // $('#institueForm').modal('show');
        $("#modalButton").html('Update');

        $('#myModalLabel').val('Update your Game Organize  here');
        // alert('Id is : '+id);
        $.ajax({
            url: 'http://localhost:3000/institute/instituteGameOrganizeGetAllDataUpdateAjax',
            method: 'POST',
            cache: false,
            data: {id: id},
            success: function (data) {

                alert(data);
                if (data.success && data.studentId != null && data.goiIdAry != null) {
                    var year = new Date(data.goiIdAry[2]);
                    year = year.getFullYear();

                    $('[name=year] option').filter(function () {
                        return ($(this).text() == year);
                    }).prop('selected', true);
                    $('[name=gameName] option').filter(function () {
                        return ($(this).text() == data.goiIdAry[5]);
                    }).prop('selected', true);
                    $('#TeamName').val(data.goiIdAry[4]);
                    for(var i=0;i<data.studentId.length;i++)
                    {
                        $(".chk").each(function () {
                            if($(this).val()===data.studentId[i])
                            {
                                $(this).prop( "checked", true );
                            }
                        });
                    }
                }

                // $('#instituteEmail').val(data.msg.instituteEmail);
            },
            error: function (data) {
                swal("Oops!", "Error!" + data.msg, "error");
            }
        });
    });

    $(document).on('click', '.deleteClass', function (e) {
        e.preventDefault();
        id = $(this).attr('value');
        swal({
            title: "Are you sure?",
            text: "Once deleted, you will not be able to recover this Game Organize !",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    // alert("Ya i came");
                    $.ajax({
                        url: 'http://localhost:3000/institute/instituteGameOrganizeDeleteAjax',
                        method: 'post',
                        cache: false,
                        data: {id: id},
                        success: function (data) {
                            // alert("->"+data.msg);
                            if (data.success && data.msg === "Successfully deleted") {
                                swal("Your record has been deleted!", {
                                    icon: "success",
                                });
                                id = 0;
                                getAllGameOrganizedData();
                            }
                            else {
                                id = 0;
                                getAllGameOrganizedData();
                                swal("Oops!", "Error! Failed to delete the data", "error");
                            }

                        },
                        error: function (data) {
                            // alert(data.msg);
                            swal("Oops!", "Error!" + data.msg, "error");
                        }
                    });

                } else {
                    swal("Your record is safe!");
                }
            });

    });
});