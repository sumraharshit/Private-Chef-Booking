

const data = {
     
    Indian: [
        {
            id: 1,
            name: "Dal Makhani",
            price: 100,

        },
        {
            id: 2,
            name: "Butter Chicken",
            price: 200,

        },
        {
            id: 3,
            name: "Paneer Tikka",
            price: 150,

        },
        {
            id: 4,
            name: "Dosa",
            price: 100,

        },{
            id: 5,
            name: "Biryani",
            price: 100,

        },

    ],

    Chinese: [
        {
            id: 6,
            name: "Chill Chicken",
            price: 200,

        },
        {
            id: 7,
            name: "Chowmein",
            price: 100,

        },
        {
            id: 8,
            name: "Mopo Tofu",
            price: 150,

        },
        {
            id: 9,
            name: "Chinese Hot Pot",
            price: 100,

        },{
            id: 10,
            name: "Spring Rolls",
            price: 100,

        },

    ],

    Mexican: [
        {
            id: 11,
            name: "Chilaquiles",
            price: 100,

        },
        {
            id: 12,
            name: "Tamales",
            price: 200,

        },
        {
            id: 13,
            name: "Chiles en nogada",
            price: 150,

        },
        {
            id: 14,
            name: "Burritos",
            price: 100,

        },{
            id: 15,
            name: "Tacos",
            price: 200,

        },

    ],

    Italian: [
        {
            id: 16,
            name: "Gnocchi",
            price: 100,

        },
        {
            id: 17,
            name: "BLasagne",
            price: 200,

        },
        {
            id: 18,
            name: "Arancini",
            price: 150,

        },
        {
            id: 19,
            name: "Panzerotto fritto",
            price: 100,

        },{
            id: 20,
            name: "Fiorentina",
            price: 100,

        },

    ],

    French: [
        {
            id: 21,
            name: "Bouillabaisse",
            price: 100,

        },
        {
            id: 22,
            name: "Chocolate soufflé",
            price: 200,

        },
        {
            id: 23,
            name: "Crêpes",
            price: 150,

        },
        {
            id: 24,
            name: "Cassoulet",
            price: 100,

        },{
            id: 25,
            name: "Quiche Lorraine",
            price: 100,

        },

    ],

    Japanese: [
        {
            id: 27,
            name: "Sushi",
            price: 100,

        },
        {
            id: 28,
            name: "Udon",
            price: 200,

        },
        {
            id: 29,
            name: "Sashimi",
            price: 150,

        },
        {
            id: 30,
            name: "Tonkatsu",
            price: 100,

        },
        {
            id: 31,
            name: "Sukiyaki",
            price: 100,

        },

    ]

};

let currentDate = new Date().toISOString().slice(0,10);
$("#date").attr('min',currentDate);

let checkedDishes = {};
function updateCheckedDishes()
{
localStorage.setItem("checkedDishes",JSON.stringify(checkedDishes)); };

console.log(date);

    $(".cuisine_button").on("click",function(){
        let cuisine =  $(this).attr("id");
        let data_menu = data[cuisine];
          $(".menu").empty();
       display(data_menu);

      });

      let menu_bill = 0;

function display(data_menu) {
    data_menu.forEach(element => {
        let option = document.createElement('div');
        option.class = 'option';
        let menuOption = document.createElement('input');
        menuOption.type ='checkbox';
        menuOption.value = element.name;
        menuOption.class = 'checkboxes';
        menuOption.name = "dish";
        menuOption.id = element.id;
        menuOption.checked = checkedDishes[element.id] || false;

        let label = document.createElement('label');
        label.setAttribute('for',element.id);
        label.appendChild(document.createTextNode(element.name + " " + element.price));
       $(".menu").append(option);
        $(option).append(menuOption);
        $(option).append(label);
       
    });

    $(".menu input[type = 'checkbox']").on("change",function() {
        const itemId = $(this).attr("id");
        checkedDishes[itemId] = $(this).is(":checked");
        updateCheckedDishes();
        if($(this).is(":checked"))
        {
            
            const item = data_menu.find(item => item.id === parseInt(itemId));
            menu_bill +=  parseFloat(item.price);
        }
        else{

            const item = data_menu.find(item=>item.id === parseInt(itemId));
            menu_bill -= parseFloat(item.price);
        }
        $(".bill").text("Total Bill:" + " " + menu_bill.toFixed(2));

    });
}
