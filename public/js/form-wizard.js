async function getAuth(credentials) {
    return await new Promise((resolve,reject) => {
        $.ajax({
            type: "POST",
            url: '/drive/auth',
            data: `credentials=${credentials}`,
            success: function(data) {
                if(data.status == 1) {
                    resolve(data.url);
                } else {
                    reject(data.msg);
                }
            }
        });
    })
}
$(function ()
{
    $("#form-wizard").steps({
        headerTag: "h3",
        bodyTag: "fieldset",
        transitionEffect: "slide",
        onStepChanging: function (event, currentIndex, newIndex) {
            if(currentIndex > newIndex) return true;
            else {
                if(currentIndex == 0) {
                    //account details
                    var email = $("#email").val();
                    if(!email) {
                        toastr.error("Missing email");
                        return false;
                    } else return true;
                } else if(currentIndex == 1) {
                    var credentials = $("#credentials").val();
                    if(!credentials) {
                        toastr.error("Missing credentials");
                        return false;
                    } else {
                        var result = getAuth(credentials).then((url) => {
                            $("#url").val(url);
                            check = false;
                            return true;
                        }).catch((msg) => {
                            toastr.error(msg);
                            return false;
                        });
                        return result;
                    }
                } else {
                    return true;
                }
            }
        },
        onFinished: function(event, currentIndex) {
            var email = $("#email").val();
            var type = $("#type").val();
            var teamdrive = $("#teamdrive").val();
            var credentials = $("#credentials").val();
            var code = $("#code").val();
            if(email && teamdrive && credentials && code) {
                $.ajax({
                    type: "POST",
                    url: '/drive/add',
                    data: `email=${email}&type=${type}&teamdrive=${teamdrive}&code=${code}&credentials=${credentials}`,
                    success: function(data) {
                        if(data.status == 1) {
                            toastr.success("Add account success");
                            setTimeout(() => {
                                location.assign(data.redirect);
                            }, 2000);
                        } else {
                            toastr.error(data.msg);
                        }
                    }
                });
            } else {
                toastr.error("Missing data");
            }
        }
    });
});