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

            this.dimensions = dimensions; // Add dimensions attribute
        }

        set_film_width(film_width){
            this.film_width = film_width/1000 //convert to m
        }

        set_film_thickness(film_thickness){
            this.film_thickness = film_thickness/1000 //convert to m
        }

        update_values(){
            this.calculate_area()
            this.calculate_box_volume()
            this.calculate_roll_volume()
            this.calculate_roll_length()
            this.calculate_length_per_area()
            this.calculate_film_density()

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
    }

var configurations = []
const inner_diameter = 152; //default inner diameter for rolls in mm
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
    "(800x1200 ⌀1150)",
    800, //pallet_width
    1200, //pallet_length
    144, //pallet_height
    1, //nr_rolls
    1150, //roll_outer_diameter
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
        "(1000x1200 ⌀1150)",
        1000, //pallet_width
        1200, //pallet_length
        144, //pallet_height
        1, //nr_rolls
        1150, //roll_outer_diameter
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
    "(1200x800 ⌀115§0)",
    1200, //pallet_width
    800, //pallet_length
    144, //pallet_height
    1, //nr_rolls
    1150, //roll_outer_diameter
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
    "(1200x1000 ⌀1150)",
    1200, //pallet_width
    1000, //pallet_length
    144, //pallet_height
    1, //nr_rolls
    1150, //roll_outer_diameter
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
    "(1200x800 ⌀1150)",
    1200, //pallet_width
    800, //pallet_length
    144, //pallet_height
    2, //nr_rolls
    1150, //roll_outer_diameter
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
    "(1200x1000 ⌀1150)",
    1200, //pallet_width
    1000, //pallet_length
    144, //pallet_height
    2, //nr_rolls
    1150, //roll_outer_diameter
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
    "(1600x1200 ⌀1150)",
    1600, //pallet_width
    1200, //pallet_length
    144, //pallet_height
    2, //nr_rolls
    1150, //roll_outer_diameter
    152, //roll_inner_diameter
    2, //pallet_tower_height
    "dubbel_EU-pall_längs_1100.png" //image filename
))
configurations.push(new Configuration(
    "dubbel EU-pall längs 3torn",
    "(1600x1200 ⌀1150)",
    1600, //pallet_width
    1200, //pallet_length
    144, //pallet_height
    2, //nr_rolls
    1150, //roll_outer_diameter
    152, //roll_inner_diameter
    3, //pallet_tower_height
    "dubbel_EU-pall_längs_1100.png" //image filename
))

//Dubbel EU-pall tvärs
configurations.push(new Configuration(
    "dubbel EU-pall tvärs",
    "(800x24000 ⌀1150)",
    2400, //pallet_width
    800, //pallet_length
    144, //pallet_height
    2, //nr_rolls
    1150, //roll_outer_diameter
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