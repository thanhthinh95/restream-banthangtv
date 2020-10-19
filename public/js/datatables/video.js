"use strict";

jQuery(document).ready(function() {
	var table = $('#datatable-ajax');
    // begin first table
    table.DataTable({
        responsive: true,
        searchDelay: 500,
        processing: true,
        serverSide: true,
        ajax: `/link/ajax/?status=${status}`,
        columns: [
            {data: 'id'},
            {data: 'url'},
            {data: 'host'},
            {data: 'host'},
            {data: 'status'},
            {data: 'id', responsivePriority: -1},
        ],
        columnDefs: [
            {
                targets: 1,
                title: 'Url',
                render: function(data, type, full, meta) {
                    return `<a target="_blank" href="${data}">${CutName(data, 50)}</a>`;
                },
            },
            {
                targets: 2,
                title: 'Host',
                render: function(data, type, full, meta) {
                    if(data) return `<button class="btn btn-outline-success waves-effect waves-light">${data}</button>`;
                    else return `<button class="btn btn-outline-light waves-effect waves-light">None</button>`;
                },
            },
            {
                targets: 3,
                title: 'M3u8',
                render: function(data, type, full, meta) {
                    if(data) return `<input type="text" class="form-control" value="${data}/m3u8/${full.md5file}/index.m3u8" readonly>`;
                    else return `<input type="text" class="form-control" readonly>`;
                },
            },
            {
                targets: 4,
                title: 'Status',
                render: function(data, type, full, meta) {
                    switch(data) {
                        case 0:
                            return `<button class="btn btn-outline-light waves-effect waves-light">None</button>`;
                        case 1:
                            return `<button class="btn btn-outline-primary waves-effect waves-light">Running</button>`;
                        case 2:
                            return `<button class="btn btn-outline-success waves-effect waves-light">Done</button>`;
                        case 3:
                            return `<button class="btn btn-outline-danger waves-effect waves-light">Error</button>`;
                    }
                },
            },
            {
                targets: -1,
                title: 'Action',
                orderable: false,
                render: function(data, type, full, meta) {
                    return `
                    <button id="delete-${full.md5file}" data-id="${full.md5file}" data-type="link" class="btn btn-outline-danger btn-delete" title="Delete">
                        <i class="fas fa-trash-alt"></i>
                    </button>`;
                },
            }
        ],
    });
});