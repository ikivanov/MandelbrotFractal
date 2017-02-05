(function() {
    function Mandelbrot(config) {
        var that = this;

        that.canvas = config.canvas;
        that.context = that.canvas.getContext("2d");

        that.colors = [];
        for (var i = 0; i < MAX; i++) {
            that.colors.push(that._hsvToRGB(i / 255, 1, i / (i + 8)));
        }
    }

    Mandelbrot.prototype = {
        render: function() {
            this._render();
        },

        _render: function() {
            var that = this,
                ctx = that.context;

            for (var row = 0; row < HEIGHT; row++) {
                for (var col = 0; col < WIDTH; col++) {
                    var c_re = (col - WIDTH / 2) * 4.0 / WIDTH,
                        c_im = (row - HEIGHT / 2) * 4.0 / WIDTH,
                        x = 0, 
                        y = 0,
                        iteration = 0;

                    while (x * x + y * y < 4 && iteration < MAX) {
                        var x_new = x * x - y * y + c_re;
                        y = 2 * x * y + c_im;
                        x = x_new;
                        iteration++;
                    } 

                    if (iteration < MAX) {
                        var color = that.colors[iteration];
                        that._setPixel(ctx, col, row, color.r, color.g, color.b, 255);
                    }
                    else {
                        that._setPixel(ctx, col, row, 0, 0, 0, 255);
                    }
                }
            }
        },

        _setPixel: function(context, x, y, red, green, blue, alpha) {
            var pixelData = context.createImageData(1, 1);

            pixelData.data[0] = red;
            pixelData.data[1] = green;
            pixelData.data[2] = blue;
            pixelData.data[3] = alpha;

            context.putImageData(pixelData, x, y);
        },

        _hsvToRGB: function (h, s, v) {
            var r, g, b, i, f, p, q, t;
            if (arguments.length === 1) {
                s = h.s, v = h.v, h = h.h;
            }
            i = Math.floor(h * 6);
            f = h * 6 - i;
            p = v * (1 - s);
            q = v * (1 - f * s);
            t = v * (1 - (1 - f) * s);
            switch (i % 6) {
                case 0: r = v, g = t, b = p; break;
                case 1: r = q, g = v, b = p; break;
                case 2: r = p, g = v, b = t; break;
                case 3: r = p, g = q, b = v; break;
                case 4: r = t, g = p, b = v; break;
                case 5: r = v, g = p, b = q; break;
            }
            return {
                r: Math.round(r * 255),
                g: Math.round(g * 255),
                b: Math.round(b * 255)
            };
        }
    };

    window.MandelbrotNamespace = {};
    MandelbrotNamespace.Mandelbrot = Mandelbrot;

    const WIDTH = 300,
        HEIGHT = 300,
        MAX = 300;
})();