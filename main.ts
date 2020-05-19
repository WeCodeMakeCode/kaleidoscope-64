function do_pattern () {
    for (let lndx = 0; lndx <= Prmtr - 1; lndx++) {
        this_line = lndx + 1
        X = Ax[this_line]
        Y = Ay[this_line]
        get_this_color()
        draw_from_origin_to(X, Y, Color)
        if (B_wait_between_lines) {
            pause(wait_between_lines)
        }
    }
}
function wait_intil_not_paused () {
    while (B_paused) {
        pause(pause_wait)
    }
}
function instructions () {
    game.showLongText("Button A Quick Press -- Pause pattern.", DialogLayout.Top)
    game.showLongText("Button B Quick Press -- Next pattern.", DialogLayout.Top)
    game.showLongText("Button B Press and Hold -- Resume automatic pattern cycling.", DialogLayout.Top)
    game.showLongText("When paused, Button A Quick Press -- remove color display", DialogLayout.Top)
    game.showLongText("Button A Press and Hold -- Change Settings", DialogLayout.Top)
}
function is_decimal (text: string) {
    if (!(text.isEmpty())) {
        local_array = text.split(".")
        if (local_array.length < 3) {
            B_N_OK = true
            for (let index5 = 0; index5 <= local_array.length - 1; index5++) {
                is_digits(local_array[index5])
                cmt = "is_digits returns b_N_OK"
            }
        } else {
            B_N_OK = false
        }
    }
}
function debug_say_and_wait (Saythis: string) {
    Out1.say(Saythis)
    pause(10000)
}
function get_options_from_player () {
    B_square = false
    b_random_field = false
    B_wait_between_lines = false
    if (game.ask("Pause after line?")) {
        B_wait_between_lines = true
    }
    if (game.ask("Change pattern wait?")) {
        get_wait_between_patterns()
    }
    if (game.ask("Random width and height?")) {
        b_random_field = true
    } else {
        if (game.ask("Square?")) {
            B_square = true
            if (game.ask("change side?")) {
                get_height()
            }
            Width = Height
        } else {
            if (game.ask("Change width?")) {
                get_width()
            }
            if (game.ask("Change heigh?")) {
                get_height()
            }
        }
    }
}
function draw_from_origin_to (Xto: number, Yto: number, Color: number) {
    x0 = orgin.x
    y0 = orgin.y
    background_image.drawLine(x0, y0, Xto, Yto, Color)
}
function get_integer (s_arg: string, min: number, max: number) {
    is_N_within_limits(s_arg, min, max)
    if (B_N_OK) {
        N_return = Math.floor(N_return)
    }
}
controller.right.onEvent(ControllerButtonEvent.Repeated, function () {
    do_arrow_key(1, 0)
})
controller.down.onEvent(ControllerButtonEvent.Repeated, function () {
    do_arrow_key(0, 1)
})
function get_odd_random_umber (min: number, max: number) {
    N_return = Math.randomRange(min, max)
    if (N_return % 2 == 0) {
        N_return = N_return - 1
    }
}
function set_next_palette () {
    len = Palette.unshift(Math.randomRange(1, 15))
    while (Palette.length < N_plt_clrs) {
        len = Palette.unshift(Math.randomRange(1, 15))
        Color_0 = Palette[0]
        Color_1 = Palette[1]
        while (len == 2 && Color_0 == Color_1) {
            Palette[0] = Math.randomRange(1, 15)
            Color_0 = Palette[0]
        }
    }
    color_ndx = 0
    display_colors()
}
function set_output_sprites () {
    destroy_sprite(Out1)
    destroy_sprite(Out2)
    destroy_sprite(Out3)
    Out1 = sprites.create(image.create(1, 1), SpriteKind.Player)
    Out2 = sprites.create(image.create(1, 1), SpriteKind.Player)
    Out3 = sprites.create(image.create(1, 1), SpriteKind.Player)
    Out3.y = scene.screenHeight() - 14
    Out2.y = Out3.y - 10
    Out1.y = Out2.y - 10
    Out1.z = 2
    Out2.z = 2
    Out3.z = 2
}
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (B_paused) {
        B_paused = false
    }
})
function do_arrow_key (dx: number, dy: number) {
    orgin.x += dx
    orgin.y += dy
}
function init_perimiter_arrays () {
    Ax = []
    Ay = []
    for (let index = 0; index <= Width_m2; index++) {
        Ax.push(index)
        Ay.push(0)
    }
    for (let index2 = 0; index2 <= Height_m2; index2++) {
        Ax.push(Width_m1)
        Ay.push(index2)
    }
    for (let index3 = 0; index3 <= Width_m2; index3++) {
        Ax.push(Width_m1 - index3)
        Ay.push(Height_m1)
    }
    for (let index4 = 0; index4 <= Height_m2; index4++) {
        Ax.push(0)
        Ay.push(Height_m1 - index4)
    }
}
function get_width () {
    _gw_limits = "" + min_wd_ht + " to " + max_width
    msg = "Enter Width " + _gw_limits
    S = game.askForString(msg)
    get_odd_integer(S, min_wd_ht, max_width)
    if (B_N_OK) {
        Width = N_return
    } else {
        say_msg_default("Must be  " + _gw_limits)
    }
}
function get_this_color () {
    len = Palette.length
    color_ndx = this_line % len
    Color = Palette[color_ndx]
}
function initialize () {
    B_wait_after_pattern = false
    ms_wait_between_patterns = 500
    wait_between_lines = 200
    // Must be at least 50. Less causes the program to not
    // run properly.
    pause_wait = 50
    Width = max_width
    Height = max_height
}
controller.A.onEvent(ControllerButtonEvent.Repeated, function () {
    B_paused = true
    initialize()
    get_options_from_player()
    make_new_field()
    B_wait_after_pattern = false
    B_paused = false
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (B_paused) {
        Color_panel.destroy()
    } else {
        B_paused = true
        B_wait_after_pattern = true
    }
})
function say_msg_default (text: string) {
    Out1.say(text, 4000)
    Out2.say("Continuing with default", 4000)
    pause(4000)
}
function get_odd_integer (s_arg: string, min: number, max: number) {
    get_integer(s_arg, min, max)
    if (B_N_OK) {
        if (N_return % 2 == 0) {
            N_return = N_return - 1
        }
    }
}
function make_new_field () {
    set_sprites_and_background()
    set_origin()
    init_perimiter_arrays()
    set_output_sprites()
}
function is_N_within_limits (this_S: string, min: number, max: number) {
    is_decimal(this_S)
    if (B_N_OK) {
        N_return = parseFloat(this_S)
        N_return = Math.floor(N_return)
        B_N_OK = N_return >= min
        B_N_OK = B_N_OK && N_return <= max
    } else {
        B_N_OK = false
    }
}
function display_colors () {
    destroy_sprite(Color_panel)
    Panel_width = 7 + 10 * N_plt_clrs
    Panel_image = image.create(Panel_width, 13)
    Color_panel = sprites.create(Panel_image, SpriteKind.Player)
    White = img`
1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
`.getPixel(0, 0)
    Black = img`
f f f f f f f f f f f f f f f f 
f f f f f f f f f f f f f f f f 
f f f f f f f f f f f f f f f f 
f f f f f f f f f f f f f f f f 
f f f f f f f f f f f f f f f f 
f f f f f f f f f f f f f f f f 
f f f f f f f f f f f f f f f f 
f f f f f f f f f f f f f f f f 
f f f f f f f f f f f f f f f f 
f f f f f f f f f f f f f f f f 
f f f f f f f f f f f f f f f f 
f f f f f f f f f f f f f f f f 
f f f f f f f f f f f f f f f f 
f f f f f f f f f f f f f f f f 
f f f f f f f f f f f f f f f f 
f f f f f f f f f f f f f f f f 
`.getPixel(0, 0)
    do_checker(Color_panel, White, Black)
    Color_panel.top = scene.screenHeight() - 14
    for (let index7 = 0; index7 <= N_plt_clrs - 1; index7++) {
        x0 = 4 + 10 * index7
        clr = Palette[index7]
        Panel_image.fillRect(x0, 2, 8, 8, clr)
    }
    Color_panel.z = 1
}
function set_origin () {
    destroy_sprite(orgin)
    orgin = sprites.create(image.create(1, 1), SpriteKind.Player)
    orgin.setFlag(SpriteFlag.StayInScreen, true)
    orgin.x = Math.floor(Width / 2)
    orgin.y = Math.floor(Height / 2)
}
controller.up.onEvent(ControllerButtonEvent.Repeated, function () {
    do_arrow_key(0, -1)
})
function is_digits (text: string) {
    B_N_OK = !(text.isEmpty())
    if (B_N_OK) {
        digits = "0123456789 "
        for (let index6 = 0; index6 <= text.length - 1; index6++) {
            aChar = text.substr(index6, 1)
            if (digits.indexOf(aChar) == -1) {
                B_N_OK = false
            }
        }
    }
}
function get_random_field_dims () {
    get_odd_random_umber(min_wd_ht, max_height)
    Height = N_return
    if (!(B_square)) {
        if (Math.randomRange(0, 1) == 1) {
            get_odd_random_umber(min_wd_ht, max_width)
        }
    }
    Width = N_return
}
function destroy_sprite (This_sprite: Sprite) {
    if (This_sprite != null) {
        This_sprite.destroy()
    }
}
function get_height () {
    _gh_limits = "" + min_wd_ht + " to " + max_height
    msg = "Enter Height " + _gh_limits
    S = game.askForString(msg)
    get_odd_integer(S, min_wd_ht, max_height)
    if (B_N_OK) {
        Height = N_return
    } else {
        say_msg_default("Must be  " + _gh_limits)
    }
}
function get_wait_between_patterns () {
    _gwbp_limits = "" + min_ptrn_wait + " to " + max_ptrn_wait
    msg = "Enter wait between patterns " + _gwbp_limits
    S = msg
    get_integer(game.askForString(msg), min_ptrn_wait, max_ptrn_wait)
    if (B_N_OK) {
        ms_wait_between_patterns = N_return
        B_wait_after_pattern = true
    } else {
        B_wait_after_pattern = false
        say_msg_default("Must be  " + _gwbp_limits)
    }
}
controller.B.onEvent(ControllerButtonEvent.Repeated, function () {
    B_wait_after_pattern = false
    B_paused = false
})
function do_checker (This_sprite: Sprite, Color1: number, Color2: number) {
    This_sprite.image.fill(Color1)
    for (let R = 0; R <= This_sprite.height - 1; R++) {
        for (let C = 0; C <= This_sprite.width - 1; C++) {
            if (R * C % 2 == 0) {
                This_sprite.image.setPixel(C, R, Color2)
            }
        }
    }
}
function set_sprites_and_background () {
    Width_m1 = Width - 1
    Width_m2 = Width - 2
    set_origin()
    Height_m1 = Height - 1
    Height_m2 = Height - 2
    Prmtr = 2 * Width_m1 + 2 * Height_m1
    scene.setBackgroundColor(1)
    destroy_sprite(Color_panel)
    destroy_sprite(background)
    background_image = image.create(Width, Height)
    background_image.fill(1)
    background = sprites.create(background_image, SpriteKind.Player)
    background.z = 0
}
controller.left.onEvent(ControllerButtonEvent.Repeated, function () {
    do_arrow_key(-1, 0)
})
let rem = 0
let background: Sprite = null
let _gwbp_limits = ""
let _gh_limits = ""
let aChar = ""
let digits = ""
let clr = 0
let Black = 0
let White = 0
let Panel_image: Image = null
let Panel_width = 0
let Color_panel: Sprite = null
let ms_wait_between_patterns = 0
let B_wait_after_pattern = false
let S = ""
let msg = ""
let _gw_limits = ""
let Height_m1 = 0
let Width_m1 = 0
let Height_m2 = 0
let Width_m2 = 0
let Out3: Sprite = null
let Out2: Sprite = null
let color_ndx = 0
let Color_1 = 0
let Color_0 = 0
let N_plt_clrs = 0
let Palette: number[] = []
let len = 0
let N_return = 0
let background_image: Image = null
let y0 = 0
let orgin: Sprite = null
let x0 = 0
let Height = 0
let Width = 0
let b_random_field = false
let B_square = false
let Out1: Sprite = null
let cmt = ""
let B_N_OK = false
let local_array: string[] = []
let pause_wait = 0
let wait_between_lines = 0
let B_wait_between_lines = false
let Color = 0
let Ay: number[] = []
let Y = 0
let Ax: number[] = []
let X = 0
let this_line = 0
let Prmtr = 0
let max_ptrn_wait = 0
let min_ptrn_wait = 0
let max_height = 0
let max_width = 0
let min_wd_ht = 0
let B_paused = false
let Empty = ""
B_paused = true
let Space = " "
min_wd_ht = 21
max_width = scene.screenWidth() - 1
max_height = scene.screenHeight() - 1
min_ptrn_wait = 100
max_ptrn_wait = 10000
initialize()
make_new_field()
if (game.ask("Instructions?")) {
    instructions()
}
B_paused = false
forever(function () {
    N_plt_clrs = 2
    Palette = []
    while (N_plt_clrs < 16) {
        rem = Prmtr % N_plt_clrs
        if (rem == 0) {
            wait_intil_not_paused()
            set_next_palette()
            do_pattern()
            pause(ms_wait_between_patterns)
            if (B_wait_after_pattern) {
                B_paused = true
            }
        }
        N_plt_clrs += 1
    }
    if (b_random_field) {
        wait_intil_not_paused()
        get_random_field_dims()
        make_new_field()
    }
})
