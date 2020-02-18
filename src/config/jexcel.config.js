export const jexcelInstanceOptions = {
  minDimensions: [10, 20],
  defaultColWidth: 100,
  tableOverflow: true,
  tableWidth: '842px',
  tableHeight: '500px',
  minDimensions: [2, 5],
  columns: [{ title: 'Column 1' }, { title: 'Column 2' }],
  //   contextMenu: function(obj, x, y, e) {
  //     var items = [];

  //     if (y == null) {
  //       // Insert a new column
  //       //   if (obj.options.allowInsertColumn == true) {
  //       //     items.push({
  //       //       title: obj.options.text.insertANewColumnBefore,
  //       //       onclick: function() {
  //       //         obj.insertColumn(1, parseInt(x), 1);
  //       //       },
  //       //     });
  //       //   }

  //       //   if (obj.options.allowInsertColumn == true) {
  //       //     items.push({
  //       //       title: obj.options.text.insertANewColumnAfter,
  //       //       onclick: function() {
  //       //         obj.insertColumn(1, parseInt(x), 0);
  //       //       },
  //       //     });
  //       //   }

  //       // Delete a column
  //       if (obj.options.allowDeleteColumn == true) {
  //         items.push({
  //           title: obj.options.text.deleteSelectedColumns,
  //           onclick: function() {
  //             obj.deleteColumn(
  //               obj.getSelectedColumns().length ? undefined : parseInt(x)
  //             );
  //           },
  //         });
  //       }

  //       // Rename column
  //       if (obj.options.allowRenameColumn == true) {
  //         items.push({
  //           title: obj.options.text.renameThisColumn,
  //           onclick: function() {
  //             obj.setHeader(x);
  //           },
  //         });
  //       }

  //       // Sorting
  //       if (obj.options.columnSorting == true) {
  //         // Line
  //         items.push({ type: 'line' });

  //         items.push({
  //           title: obj.options.text.orderAscending,
  //           onclick: function() {
  //             obj.orderBy(x, 0);
  //           },
  //         });
  //         items.push({
  //           title: obj.options.text.orderDescending,
  //           onclick: function() {
  //             obj.orderBy(x, 1);
  //           },
  //         });
  //       }
  //     } else {
  //       // Insert new row
  //       if (obj.options.allowInsertRow == true) {
  //         items.push({
  //           title: obj.options.text.insertANewRowBefore,
  //           onclick: function() {
  //             obj.insertRow(1, parseInt(y), 1);
  //           },
  //         });

  //         items.push({
  //           title: obj.options.text.insertANewRowAfter,
  //           onclick: function() {
  //             obj.insertRow(1, parseInt(y));
  //           },
  //         });
  //       }

  //       if (obj.options.allowDeleteRow == true) {
  //         items.push({
  //           title: obj.options.text.deleteSelectedRows,
  //           onclick: function() {
  //             obj.deleteRow(
  //               obj.getSelectedRows().length ? undefined : parseInt(y)
  //             );
  //           },
  //         });
  //       }

  //       if (x) {
  //         if (obj.options.allowComments == true) {
  //           items.push({ type: 'line' });

  //           var title = obj.records[y][x].getAttribute('title') || '';

  //           items.push({
  //             title: title
  //               ? obj.options.text.editComments
  //               : obj.options.text.addComments,
  //             onclick: function() {
  //               obj.setComments([x, y], prompt(obj.options.text.comments, title));
  //             },
  //           });

  //           if (title) {
  //             items.push({
  //               title: obj.options.text.clearComments,
  //               onclick: function() {
  //                 obj.setComments([x, y], '');
  //               },
  //             });
  //           }
  //         }
  //       }
  //     }

  //     // Line
  //     items.push({ type: 'line' });

  //     // Save
  //     if (obj.options.allowExport) {
  //       items.push({
  //         title: obj.options.text.saveAs,
  //         shortcut: 'Ctrl + S',
  //         onclick: function() {
  //           obj.download();
  //         },
  //       });
  //     }

  //     // About
  //     if (obj.options.about) {
  //       items.push({
  //         title: obj.options.text.about,
  //         onclick: function() {
  //           alert(obj.options.about);
  //         },
  //       });
  //     }

  //     return items;
  //   },
};
