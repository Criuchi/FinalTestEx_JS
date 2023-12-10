function productTable(products) {
  const table = $("<table>").addClass("productsTable");
  const tbody = $("<tbody>");
  const thead = $("<thead>");

  //table header row
  const tr = $("<tr>");

  //append rows with header cells(th) + append anchor tags
  const headers = ["Title", "Price", "Rating", "Brand", "Images"];

  headers.forEach((header, index) => {
    const th = $("<th>");
    const anchor = $("<a>")
      .attr("href", "#")
      .attr("data-index", index)
      .text(header);
    th.addClass("sortRow").append(anchor);
    tr.append(th);
  });

  // Append the header row to the thead element
  thead.append(tr);

  // Append the thead to the table
  table.append(thead);

  //loop through each product
  $.each(products, function (index, value) {
    //create row element
    let row = $("<tr>");
    //displays the content for each column (data cell)
    row.append(
      $("<td>").text(value.title),
      $("<td>").text(value.price),
      $("<td>").text(value.rating),
      $("<td>").text(value.brand),
      $("<td>").html(
        `<a href="#" class="open-modal" data-index="${index}">Click for img</a>`
      )
    );
    //append to product row
    tbody.append(row);
  });

  // Append the tbody to the table
  table.append(tbody);

  //append the entire table to the id
  $("#tableContainer").append(table);

  //search function based for brand/title
  function search() {
    // Get the value of the search input
    let searchTerm = $("#filter-search").val().toLowerCase();

    // Loop through each product row in the table class
    $(".productsTable tbody tr").each(function () {
      // Get the title/brand row
      let title = $(this).find("td:first-child").text().toLowerCase();
      let brand = $(this).find("td:nth-child(4)").text().toLowerCase();
      // Check if the search term is present in title/brand strings (T/F if found)
      let titleMatch = title.includes(searchTerm);
      let brandMatch = brand.includes(searchTerm);

      if (searchTerm && (titleMatch || brandMatch)) {
        $(this).css("background-color", "yellow").css("color", "purple");
      } else {
        $(this).css("background-color", "").css("color", "black");
      }
    });
  }

  // button filtering
  // initialize price range variables
  let minPrice = 0;
  let maxPrice = Infinity;

  //events for btns, 1.max 2.min
  $(".btn-1").on("click", function () {
    filterPrice(500, Infinity);
  });

  $(".btn-2").on("click", function () {
    filterPrice(0, 500);
  });

  //takes in min and max representing maximun and minimum values of price range
  function filterPrice(min, max) {
    // Update global minPrice and maxPrice
    minPrice = min;
    maxPrice = max;
    // Loop through each product row
    $(".productsTable tbody tr").each(function () {
      // Get the price row
      let price = parseFloat($(this).find("td:nth-child(2)").text());

      // Toggle the visibility of the row based on whether the price is within the specified range
      $(this).toggle(price >= minPrice && price <= maxPrice);
    });
  }

  // Bind search function to input event
  $("#filter-search").on("input", search);

  //Bind filter button to click event
  $(".btn").on("click", function () {
    filterPrice(minPrice, maxPrice);
  });

  //modal function
  let $modal = $('<div class="modal"></div>');
  let $buttonClose = $('<button class="btn-close">Close</button>');

  //append to body
  $("body").append($modal, $buttonClose);

  //select the img row
  let $imgRow = $(".productsTable tbody tr td:nth-child(5)");

  function openModal($clone) {
    $modal.empty();
    //append cloned image to modals
    //$modal.append($clone.clone());
    // Extract the index from the cloned element's data-index attribute
    let dataIndex = $clone.data("index");
    // Get the URL of the first image from the images array for the corresponding product
    let imageUrl = products[dataIndex].images[0];
    // Create an image element for the modal
    let $modalImage = $("<img>")
      .attr("src", imageUrl)
      .addClass("modal-content");

    // Append the image to the modal
    $modal.append($modalImage);

    //display modal
    $modal.fadeIn();

    //hide other elements
    $("body").css({
      background: "black",
    });

    $("#search").css({
      display: "none",
    });

    $(".btn-1").css({
      color: "black",
    });

    $(".btn-2").css({
      color: "black",
    });

    $("th a").css({
      color: "black",
    });

    $("td a").css({
      color: "black",
    });

    //display close button
    $buttonClose.css({
      background: "white",
      color: "black",
      display: "block",
      position: "fixed",
      top: "10%",
      left: "10%",
      width: "100px",
      height: "50px",
    });

    //image style
    $modalImage.css({
      position: "fixed",
      top: "25%",
      left: "32%",
    });
  }

  //close modal
  function closeModal() {
    $modal.fadeOut();

    //display elements again
    $buttonClose.css({
      display: "none",
    });

    $("body").css({
      background: "white",
    });

    $("#search").css({
      display: "block",
    });

    $(".btn-1").css({
      color: "white",
    });

    $(".btn-2").css({
      color: "white",
    });

    $("th a").css({
      color: "blue",
    });

    $("td a").css({
      color: "purple",
    });
  }

  //event for image link
  $imgRow.on("click", ".open-modal", function () {
    // Clone the clicked image
    let $clone = $(this).clone();
    // Open the modal with the cloned image
    openModal($clone);
  });

  // Click event handler for the modal to close it
  $buttonClose.on("click", function () {
    closeModal();
  });

  // Click event handler for the modal content to prevent closing when clicked inside
  $modal.on("click", ".modal-content", function (event) {
    event.stopPropagation(); // Prevent the modal from closing when clicked inside
  });
}

//output
$(function () {
  let container = $("#tableContainer");
  console.log(container);

  //API
  const apiUrl = "https://dummyjson.com/products";

  async function productData() {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      productTable(data.products);
    } catch (error) {
      console.log("There is an error", error);
    }
  }
  productData();
});
