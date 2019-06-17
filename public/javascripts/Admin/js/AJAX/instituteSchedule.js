$(document).ready(function () {


    $("#menu1").children().removeClass("active");
    $("#menu1").children("#liGameSchedule").addClass("active");

    getBindData();
    getAllScheduledData();
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
    }
    function getAllScheduledData(){
        $.ajax({
            url: 'http://localhost:3000/institute/instituteScheduleGetAllDataAjax',
            cache: false,
            method: 'post',
            success: function (data) {
                // alert(data);
                if(data.msg==="Session Expired")
                {
                    window.location.replace('/');
                }

                alert("Data Came "+data);
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
                swal("Oops!", "Error!"+data.msg, "error");
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
        var scheduleVenue=document.getElementById('scheduleVenue');
        scheduleVenue=scheduleVenue.value;
        var scheduleDate=document.getElementById('scheduleDate');
        scheduleDate=scheduleDate.value;
        if (buttonValue == "Save") {

            alert('cliked');

            $.ajax({
                url: 'http://localhost:3000/institute/instituteScheduleAddAjax',
                cache: false,
                data: {gameName:gameName,gender:gender,scheduleVenue:scheduleVenue,scheduleDate:scheduleDate},
                method: 'post',
                success: function (data) {
                    // alert(data);
                    if(data.msg==="Session Expired")
                    {
                        window.location.replace('/');
                    }
                    else if(data.success && data.msg==="Successfully schedule created")
                    {
                        swal({
                            title: "Good job!",
                            text: "Successfully schedule created",
                            icon: "success",
                            button: "Ok!",
                        });
                        $('#scheduleForm').modal('hide');
                    }
                    else if(data.success && data.msg==="Failed to create the schedule")
                    {
                        swal("Oops!", "Error! Failed to create the schedule", "error");
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