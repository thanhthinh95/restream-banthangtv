//init
toastr.options = {
    "closeButton": false,
    "newestOnTop": false,
    "progressBar": false,
    "positionClass": "toast-bottom-right",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
};
function goBack() {
    window.history.back();
}
function removeHtml(str) {
    return str.replace(/<(?:.|\n)*?>/gm, '');
}
function CutName(string,length) {
    string = string.trim();
    string = removeHtml(string);
    if(string.length < length) return string;
    else {
        string = string.substring(0, length) + " ...";
        return string;
    }
}
$(document).ready(function() {
    var clipboard = new ClipboardJS('.btn-clipboard');
    clipboard.on('success', function() {
        toastr.success("Copied!");
    });
    $(".select2").select2({
        width: '100%'
    });
    $('#frmAuth').submit(function(e) {
        e.preventDefault();
        var url = $(this).attr("action");
        $.ajax({
            type: "POST",
            url: url,
            data: $(this).serialize(),
            success: function(data) {
                if(data.status == 1) location.reload();
                else toastr.error(data.msg);
            }
        });
    });
    $('#frmAction').submit(function(e) {
        e.preventDefault();
        var url = $(this).attr("action");
        $.ajax({
            type: "POST",
            url: url,
            data: $(this).serialize(),
            success: function(data) {
                if(data.status == 1) {
                    toastr.success(data.msg);
                    setTimeout(() => {
                        location.assign(data.redirect);
                    }, 2000);
                }
                else toastr.error(data.msg);
            }
        });
    });
    $('#frmFolder').submit(function(e) {
        e.preventDefault();
        toastr.info("Please wait...");
        $.ajax({
            type: "GET",
            url: 'https://api.animehd.vn/getlist.php',
            data: $(this).serialize(),
            success: function(data) {
                toastr.success("Get folder success");
                for(var i=0;i<data.length;i++) {
                    $("#list").append(data[i].url + "\n");
                }
            }
        });
    });
    $(document).on("click",".btn-delete",function() {
        var id = $(this).attr("data-id");
        var type = $(this).attr("data-type");
        swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true
        }).then((result) => {
            if (result.value) {
                $.ajax({
                    type: "POST",
                    url: `/${type}/delete/`,
                    data: `id=${id}`,
                    success: function() {
                        $('#datatable-ajax').DataTable().ajax.reload();
                        swal.fire(
                            'Deleted!',
                            'Your file has been deleted.',
                            'success'
                        )
                    }
                });
            } else if (
                // Read more about handling dismissals
                result.dismiss === Swal.DismissReason.cancel
            ) {
                swal.fire(
                    'Cancelled',
                    'Your imaginary file is safe :)',
                    'error'
                )
            }
        });
    })
});