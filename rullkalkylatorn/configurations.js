class Configuration {
        //everything is in mm
        constructor(
            name, 
            dimensions, //dimensions as a string, e.g. "800x1200x144"
            pallet_width, 
            pallet_length, 
            pallet_height, 
            nr_rolls, 
            roll_outer_diameter, 
            roll_inner_diameter, 
            pallet_tower_height,
            image_filename = "placeholder_roll.png" //optional image filename
        ){

            console.log(`Creating configuration: ${name}`)
            this.name = name
            this.pallet_width = pallet_width/1000 //convert to m
            this.pallet_length = pallet_length/1000 //convert to m
            this.pallet_height = pallet_height/1000 //convert to m
            this.nr_rolls = nr_rolls
            this.roll_outer_diameter = roll_outer_diameter/1000 //convert to m
            this.roll_inner_diameter = inner_diameter/1000 //convert to m
            this.pallet_tower_height = pallet_tower_height //how many pallets can be stacked

            this.image = image_filename //image filename for the configuration

            this.film_thickness = 0.005 //default film thickness in m
            this.film_width = 1

            this.area = 0
            this.box_volume = 0
            this.roll_volume = 0
            this.roll_length = 0
            this.length_per_area = 0
            this.film_density = 0

            this.cargo_dims = ""
            this.cargo_tolerances = ""
            this.cargo_volume = 0

            this.nothing= ""
            this.dimensions = dimensions; // Add dimensions attribute
        }

        set_film_width(film_width){
            this.film_width = film_width/1000 //convert to m
        }

        set_film_thickness(film_thickness){
            this.film_thickness = film_thickness/1000 //convert to m
        }

        update_values(){
            this.calculate_area();
            this.calculate_box_volume();
            this.calculate_roll_volume();
            this.calculate_roll_length();
            this.calculate_length_per_area();
            this.calculate_film_density();

            // Hämta lastbilsmått från formuläret
            const truck_width = parseFloat(document.getElementById("truck-width").value) || 2.45;
            const truck_length = parseFloat(document.getElementById("truck-length").value) || 13.61;
            const truck_height = parseFloat(document.getElementById("truck-height").value) || 2.70;
            this.calculate_truck_load(truck_width, truck_length, truck_height);
        }

        calculate_area(){
            var length = Math.max(this.pallet_length, this.film_width)
            var width = Math.max(this.pallet_width, this.roll_outer_diameter*this.nr_rolls)
            var area = length*width
            this.area = area
            return area
        }

        calculate_box_volume(){
            var area = this.calculate_area()
            var height = this.roll_outer_diameter + this.pallet_height
            var volume = area*height
            this.box_volume = volume
            return this.box_volume
        }

        calculate_roll_volume(){
            var R = this.roll_outer_diameter/2
            var r  = this.roll_inner_diameter/2
            var volume = (R*R-r*r)*Math.PI * this.film_width * this.nr_rolls
            this.roll_volume = volume
            return this.roll_volume
        }

        calculate_roll_length(){
            var volume = this.calculate_roll_volume()/this.nr_rolls
            var length = volume/this.film_width/this.film_thickness
            this.roll_length = length
            return this.roll_length
        }

        calculate_length_per_area(){
            var area = this.calculate_area()
            var total_length = this.calculate_roll_length() * this.nr_rolls
            total_length *= this.pallet_tower_height
            this.length_per_area = total_length/area
            return this.length_per_area
        }
        calculate_film_density(){
            var volume = this.calculate_box_volume()
            var roll_volume = this.calculate_roll_volume()
            this.film_density= roll_volume/volume
            return this.film_density
        }
        calculate_dimentsions(){
            this.dimensions = `${this.pallet_width*1000}x${this.pallet_length*1000}x${this.pallet_height*1000} ⌀${this.roll_outer_diameter*1000}`
            return this.dimensions
        }
        calculate_truck_load(truck_width = 2.450, truck_length = 13.61, truck_height = 2.700, truck_tolerances = [50, 50, 50]) {
            var pallet_width = Math.max(this.pallet_width, this.roll_outer_diameter*this.nr_rolls)
            var pallet_length = Math.max(this.pallet_length, this.film_width)
            var pallet_height = this.pallet_height + this.roll_outer_diameter
            console.log(`width:${pallet_width}, length:${pallet_length}, height${pallet_height}`)
            //there are two ways to load the truck, either with the pallets in the longitudinal direction or in the transverse direction
            var pallets_in_height = Math.floor(truck_height/pallet_height)*1.00
            var pallets_in_width = Math.floor(truck_width/pallet_width)*1.00
            var pallets_in_length = Math.floor(truck_length/pallet_length)*1.00

            var trans_pallets_in_width = Math.floor(truck_width/pallet_length)*1.00
            var trans_pallets_in_length = Math.floor(truck_length/pallet_width)*1.00


            if (trans_pallets_in_length*trans_pallets_in_width > pallets_in_length * pallets_in_width){
                pallets_in_width = trans_pallets_in_width
                pallets_in_length = trans_pallets_in_length
                var new_width = pallet_length
                var new_length = pallet_width
                pallet_width = new_width
                pallet_length = new_length
            }

            var total_width = pallets_in_width * pallet_width;
            var total_length = pallets_in_length * pallet_length;
            var total_height = pallets_in_height * pallet_height;

            var tolerance_width = truck_width - total_width;
            var tolerance_height = truck_height - total_height;
            var tolerance_length = truck_length - total_length;

            var cargo_dims =  `${total_width} x ${total_length} x ${total_height}`
            var cargo_tolerances = `${tolerance_width} x ${tolerance_length} x ${tolerance_height}`
            var cargo_volume = pallets_in_width * pallets_in_height * pallets_in_length * this.roll_volume

            this.nr_pallets_in_truck = `${pallets_in_width} x ${pallets_in_length} x ${pallets_in_height}`
            
            this.cargo_dims = `${total_width.toFixed(2)} x ${total_length.toFixed(2)} x ${total_height.toFixed(2)}`
            this.cargo_tolerances = `${tolerance_width.toFixed(2)} x ${tolerance_length.toFixed(2)} x ${tolerance_height.toFixed(2)}`
            this.cargo_volume = Number(cargo_volume.toFixed(2))

            return;
        }
    }

var configurations = []
const inner_diameter = 180; //default inner diameter for rolls in mm
configurations.push(new Configuration(
    "Egen rulle",
    "",
    800, //pallet_width
    1200, //pallet_length
    144, //pallet_height
    1, //nr_rolls
    800, //roll_outer_diameter
    152, //roll_inner_diameter
    1.5, //pallet_tower_height
    "EU-pall_längs_800.png" //image filename
))
//EU Pall längs
configurations.push(new Configuration(
    "EU-pall längs",
    "(800x1200 ⌀800)",
    800, //pallet_width
    1200, //pallet_length
    144, //pallet_height
    1, //nr_rolls
    800, //roll_outer_diameter
    152, //roll_inner_diameter
    1.5, //pallet_tower_height
    "EU-pall_längs_800.png" //image filename
))
configurations.push(new Configuration(
    "EU-pall längs",
    "(800x1200 ⌀1000)",
    800, //pallet_width
    1200, //pallet_length
    144, //pallet_height
    1, //nr_rolls
    1000, //roll_outer_diameter
    152, //roll_inner_diameter
    1.5, //pallet_tower_height
    "EU-pall_längs_1000.png" //image filename
))
configurations.push(new Configuration(
    "EU-pall längs",
    "(800x1200 ⌀1100)",
    800, //pallet_width
    1200, //pallet_length
    144, //pallet_height
    1, //nr_rolls
    1100, //roll_outer_diameter
    152, //roll_inner_diameter
    1.5, //pallet_tower_height
    "EU-pall_längs_1100.png" //image filename
))
configurations.push(new Configuration(
    "EU-pall längs",
    "(800x1200 ⌀1200)",
    800, //pallet_width
    1200, //pallet_length
    144, //pallet_height
    1, //nr_rolls
    1200, //roll_outer_diameter
    152, //roll_inner_diameter
    1.5, //pallet_tower_height
    "EU-pall_längs_1100.png" //image filename
))

//Industripall längs
configurations.push(new Configuration(
        "Industripall längs",
        "(1000x1200 ⌀1000)",
        1000, //pallet_width
        1200, //pallet_length
        144, //pallet_height
        1, //nr_rolls
        1000, //roll_outer_diameter
        152, //roll_inner_diameter
        1.5, //pallet_tower_height
        "Industripall_längs_1000.png" //image filename
    ))
configurations.push(new Configuration(
        "Industripall längs",
        "(1000x1200 ⌀1100)",
        1000, //pallet_width
        1200, //pallet_length
        144, //pallet_height
        1, //nr_rolls
        1100, //roll_outer_diameter
        152, //roll_inner_diameter
        1.5, //pallet_tower_height
        "Industripall_längs_1100.png" //image filename
    ))
configurations.push(new Configuration(
        "Industripall längs",
        "(1000x1200 ⌀1200)",
        1000, //pallet_width
        1200, //pallet_length
        144, //pallet_height
        1, //nr_rolls
        1200, //roll_outer_diameter
        152, //roll_inner_diameter
        1.5, //pallet_tower_height
        "Industripall_längs_1100.png" //image filename
    ))

//EU Pall tvärs
configurations.push(new Configuration(
    "EU-pall tvärs",
    "(1200x800 ⌀1000)",
    1200, //pallet_width
    800, //pallet_length
    144, //pallet_height
    1, //nr_rolls
    1000, //roll_outer_diameter
    152, //roll_inner_diameter
    1.5, //pallet_tower_height
    "EU-pall_tvärs_1000.png" //image filename
))
configurations.push(new Configuration(
    "EU-pall tvärs",
    "(1200x800 ⌀1100)",
    1200, //pallet_width
    800, //pallet_length
    144, //pallet_height
    1, //nr_rolls
    1100, //roll_outer_diameter
    152, //roll_inner_diameter
    1.5, //pallet_tower_height
    "EU-pall_tvärs_1100.png" //image filename
))
configurations.push(new Configuration(
    "EU-pall tvärs",
    "(1200x800 ⌀1200)",
    1200, //pallet_width
    800, //pallet_length
    144, //pallet_height
    1, //nr_rolls
    1200, //roll_outer_diameter
    152, //roll_inner_diameter
    1.5, //pallet_tower_height
    "EU-pall_tvärs_1100.png" //image filename
))

//Industrupall tvärs
configurations.push(new Configuration(
    "Industripall tvärs",
    "(1200x1000 ⌀1000)",
    1200, //pallet_width
    1000, //pallet_length
    144, //pallet_height
    1, //nr_rolls
    1000, //roll_outer_diameter
    152, //roll_inner_diameter
    1.5, //pallet_tower_height
    "Industripall_tvärs_1000.png" //image filename
))
configurations.push(new Configuration(
    "Industripall tvärs",
    "(1200x1000 ⌀1100)",
    1200, //pallet_width
    1000, //pallet_length
    144, //pallet_height
    1, //nr_rolls
    1100, //roll_outer_diameter
    152, //roll_inner_diameter
    1.5, //pallet_tower_height
    "Industripall_tvärs_1100.png" //image filename
))
configurations.push(new Configuration(
    "Industripall tvärs",
    "(1200x1000 ⌀1200)",
    1200, //pallet_width
    1000, //pallet_length
    144, //pallet_height
    1, //nr_rolls
    1200, //roll_outer_diameter
    152, //roll_inner_diameter
    1.5, //pallet_tower_height
    "Industripall_tvärs_1100.png" //image filename
))

//EU Pall tvärs dubbla rullar
configurations.push(new Configuration(
    "EU-pall tvärs dubbla rullar 3torn",
    "(1200x800 ⌀600)",
    1200, //pallet_width
    800, //pallet_length
    144, //pallet_height
    2, //nr_rolls
    600, //roll_outer_diameter
    152, //roll_inner_diameter
    3, //pallet_tower_height
    "EU-pall_tvärs_dubbla_rullar_600.png" //image filename
))
configurations.push(new Configuration(
    "EU-pall tvärs dubbla rullar",
    "(1200x800 ⌀800)",
    1200, //pallet_width
    800, //pallet_length
    144, //pallet_height
    2, //nr_rolls
    800, //roll_outer_diameter
    152, //roll_inner_diameter
    2, //pallet_tower_height
    "EU-pall_tvärs_dubbla_rullar_800.png" //image filename
))
configurations.push(new Configuration(
    "EU-pall tvärs dubbla rullar 3torn",
    "(1200x800 ⌀800)",
    1200, //pallet_width
    800, //pallet_length
    144, //pallet_height
    2, //nr_rolls
    800, //roll_outer_diameter
    152, //roll_inner_diameter
    3, //pallet_tower_height
    "EU-pall_tvärs_dubbla_rullar_800.png" //image filename
))
configurations.push(new Configuration(
    "EU-pall tvärs dubbla rullar",
    "(1200x800 ⌀1000)",
    1200, //pallet_width
    800, //pallet_length
    144, //pallet_height
    2, //nr_rolls
    1000, //roll_outer_diameter
    152, //roll_inner_diameter
    2, //pallet_tower_height
    "EU-pall_tvärs_dubbla_rullar_1000.png" //image filename
))
configurations.push(new Configuration(
    "EU-pall tvärs dubbla rullar",
    "(1200x800 ⌀1100)",
    1200, //pallet_width
    800, //pallet_length
    144, //pallet_height
    2, //nr_rolls
    1100, //roll_outer_diameter
    152, //roll_inner_diameter
    2, //pallet_tower_height
    "EU-pall_tvärs_dubbla_rullar_1100.png" //image filename
))
configurations.push(new Configuration(
    "EU-pall tvärs dubbla rullar",
    "(1200x800 ⌀1200)",
    1200, //pallet_width
    800, //pallet_length
    144, //pallet_height
    2, //nr_rolls
    1200, //roll_outer_diameter
    152, //roll_inner_diameter
    2, //pallet_tower_height
    "EU-pall_tvärs_dubbla_rullar_1100.png" //image filename
))

//Industripall tvärs dubbla rullar
configurations.push(new Configuration(
    "Industripall tvärs dubbla rullar 3torn",
    "(1200x1000 ⌀600)",
    1200, //pallet_width
    1000, //pallet_length
    144, //pallet_height
    2, //nr_rolls
    600, //roll_outer_diameter
    152, //roll_inner_diameter
    3, //pallet_tower_height
    "Industripall_tvärs_dubbla_rullar_600.png" //image filename
))
configurations.push(new Configuration(
    "Industripall tvärs dubbla rullar 3torn",
    "(1200x1000 ⌀800)",
    1200, //pallet_width
    1000, //pallet_length
    144, //pallet_height
    2, //nr_rolls
    800, //roll_outer_diameter
    152, //roll_inner_diameter
    3, //pallet_tower_height
    "Industripall_tvärs_dubbla_rullar_800.png" //image filename
))
configurations.push(new Configuration(
    "Industripall tvärs dubbla rullar",
    "(1200x1000 ⌀800)",
    1200, //pallet_width
    1000, //pallet_length
    144, //pallet_height
    3, //nr_rolls
    800, //roll_outer_diameter
    152, //roll_inner_diameter
    2, //pallet_tower_height
    "Industripall_tvärs_dubbla_rullar_800.png" //image filename
))
configurations.push(new Configuration(
    "Industripall tvärs dubbla rullar",
    "(1200x1000 ⌀1000)",
    1200, //pallet_width
    1000, //pallet_length
    144, //pallet_height
    2, //nr_rolls
    1000, //roll_outer_diameter
    152, //roll_inner_diameter
    2, //pallet_tower_height
    "Industripall_tvärs_dubbla_rullar_1000.png" //image filename
))
configurations.push(new Configuration(
    "Industripall tvärs dubbla rullar",
    "(1200x1000 ⌀1100)",
    1200, //pallet_width
    1000, //pallet_length
    144, //pallet_height
    2, //nr_rolls
    1100, //roll_outer_diameter
    152, //roll_inner_diameter
    2, //pallet_tower_height
    "Industripall_tvärs_dubbla_rullar_1100.png" //image filename
))
configurations.push(new Configuration(
    "Industripall tvärs dubbla rullar",
    "(1200x1000 ⌀1200)",
    1200, //pallet_width
    1000, //pallet_length
    144, //pallet_height
    2, //nr_rolls
    1200, //roll_outer_diameter
    152, //roll_inner_diameter
    2, //pallet_tower_height
    "Industripall_tvärs_dubbla_rullar_1100.png" //image filename
))
//Dubbel EU-pall längs
configurations.push(new Configuration(
    "dubbel EU-pall längs 3torn",
    "(1600x1200 ⌀800)",
    1600, //pallet_width
    1200, //pallet_length
    144, //pallet_height
    2, //nr_rolls
    800, //roll_outer_diameter
    152, //roll_inner_diameter
    3, //pallet_tower_height
    "dubbel_EU-pall_längs_800.png" //image filename
))
configurations.push(new Configuration(
    "dubbel EU-pall längs ",
    "(1600x1200 ⌀800)",
    1600, //pallet_width
    1200, //pallet_length
    144, //pallet_height
    2, //nr_rolls
    800, //roll_outer_diameter
    152, //roll_inner_diameter
    2, //pallet_tower_height
    "dubbel_EU-pall_längs_800.png" //image filename
))
configurations.push(new Configuration(
    "dubbel EU-pall längs ",
    "(1600x1200 ⌀1000)",
    1600, //pallet_width
    1200, //pallet_length
    144, //pallet_height
    2, //nr_rolls
    1000, //roll_outer_diameter
    152, //roll_inner_diameter
    2, //pallet_tower_height
    "dubbel_EU-pall_längs_1000.png" //image filename
))
configurations.push(new Configuration(
    "dubbel EU-pall längs ",
    "(1600x1200 ⌀1100)",
    1600, //pallet_width
    1200, //pallet_length
    144, //pallet_height
    2, //nr_rolls
    1100, //roll_outer_diameter
    152, //roll_inner_diameter
    2, //pallet_tower_height
    "dubbel_EU-pall_längs_1100.png" //image filename
))
configurations.push(new Configuration(
    "dubbel EU-pall längs ",
    "(1600x1200 ⌀1200)",
    1600, //pallet_width
    1200, //pallet_length
    144, //pallet_height
    2, //nr_rolls
    1200, //roll_outer_diameter
    152, //roll_inner_diameter
    2, //pallet_tower_height
    "dubbel_EU-pall_längs_1100.png" //image filename
))
configurations.push(new Configuration(
    "dubbel EU-pall längs 3torn",
    "(1600x1200 ⌀1200)",
    1600, //pallet_width
    1200, //pallet_length
    144, //pallet_height
    2, //nr_rolls
    1200, //roll_outer_diameter
    152, //roll_inner_diameter
    3, //pallet_tower_height
    "dubbel_EU-pall_längs_1100.png" //image filename
))

//Dubbel EU-pall tvärs
configurations.push(new Configuration(
    "dubbel EU-pall tvärs",
    "(800x24000 ⌀1200)",
    2400, //pallet_width
    800, //pallet_length
    144, //pallet_height
    2, //nr_rolls
    1200, //roll_outer_diameter
    152, //roll_inner_diameter
    2, //pallet_tower_height
    "dubbel_EU-pall_tvärs_1100.png" //image filename
))

// ...efter att alla configurations har skapats...
configurations.forEach(cfg => {
    if (typeof cfg.image === "string") {
        cfg.image = cfg.image.replace(/längs/g, "langs").replace(/tvärs/g, "tvars");
    }
});
