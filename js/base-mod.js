/**
 * All the modified minified based on parts of Roll20's `app.js`
 */
function d20plusMod() {
	d20plus.mod = {};

	// modified to allow players to use the FX tool, and to keep current colour selections when switching tool
	// BEGIN ROLL20 CODE
	d20plus.mod.setMode = function (e) {
		d20plus.ut.log("Setting mode " + e);
		// BEGIN MOD
		// "text" === e || "rect" === e || "polygon" === e || "path" === e || "pan" === e || "select" === e || "targeting" === e || "measure" === e || window.is_gm || (e = "select"),
		// END MOD
		"text" == e ? $("#editor").addClass("texteditmode") : $("#editor").removeClass("texteditmode"),
			$("#floatingtoolbar li").removeClass("activebutton"),
			$("#" + e).addClass("activebutton"),
		"fog" == e.substring(0, 3) && $("#fogcontrols").addClass("activebutton"),
		"rect" == e && ($("#drawingtools").addClass("activebutton"),
			$("#drawingtools").removeClass("text path polygon line_splitter").addClass("rect")),
		"text" == e && ($("#drawingtools").addClass("activebutton"),
			$("#drawingtools").removeClass("rect path polygon line_splitter").addClass("text")),
		"path" == e && $("#drawingtools").addClass("activebutton").removeClass("text rect polygon line_splitter").addClass("path"),
			"polygon" == e ? $("#drawingtools").addClass("activebutton").removeClass("text rect path line_splitter").addClass("polygon") : d20.engine.finishCurrentPolygon(),
			// BEGIN MOD (also line_splitter added to above removeClass calls
		"line_splitter" == e && ($("#drawingtools").addClass("activebutton"),
			$("#drawingtools").removeClass("rect path polygon text").addClass("line_splitter")),
			// END MOD
		"pan" !== e && "select" !== e && d20.engine.unselect(),
			"pan" == e ? ($("#select").addClass("pan").removeClass("select").addClass("activebutton"),
				d20.token_editor.removeRadialMenu(),
				$("#editor-wrapper").addClass("panning")) : $("#editor-wrapper").removeClass("panning"),
		"select" == e && $("#select").addClass("select").removeClass("pan").addClass("activebutton"),
			$("#floatingtoolbar .mode").hide(),
		("text" == e || "select" == e) && $("#floatingtoolbar ." + e).show(),
			"gridalign" == e ? $("#gridaligninstructions").show() : "gridalign" === d20.engine.mode && $("#gridaligninstructions").hide(),
			"targeting" === e ? ($("#targetinginstructions").show(),
				$("#upperCanvas").addClass("targeting"),
				d20.engine.canvas.hoverCursor = "crosshair") : "targeting" === d20.engine.mode && ($("#targetinginstructions").hide(),
				$("#upperCanvas").removeClass("targeting"),
			d20.engine.nextTargetCallback && _.defer(function () {
				d20.engine.nextTargetCallback && d20.engine.nextTargetCallback(!1)
			}),
				d20.engine.canvas.hoverCursor = "move"),
			// BEGIN MOD
			// console.log("Switch mode to " + e),
			d20.engine.mode = e,
		"measure" !== e && window.currentPlayer && d20.engine.measurements[window.currentPlayer.id] && !d20.engine.measurements[window.currentPlayer.id].sticky && (d20.engine.announceEndMeasure({
			player: window.currentPlayer.id
		}),
			d20.engine.endMeasure()),
			d20.engine.canvas.isDrawingMode = "path" == e ? !0 : !1;
		if ("text" == e || "path" == e || "rect" == e || "polygon" == e || "fxtools" == e
			// BEGIN MOD
			|| "measure" == e) {
			// END MOD
			$("#secondary-toolbar").show();
			$("#secondary-toolbar .mode").hide();
			$("#secondary-toolbar ." + e).show();
			("path" == e || "rect" == e || "polygon" == e) && ("" === $("#path_strokecolor").val() && ($("#path_strokecolor").val("#000000").trigger("change-silent"),
				$("#path_fillcolor").val("transparent").trigger("change-silent")),
				d20.engine.canvas.freeDrawingBrush.color = $("#path_strokecolor").val(),
				d20.engine.canvas.freeDrawingBrush.fill = $("#path_fillcolor").val() || "transparent",
				$("#path_width").trigger("change")),
			"fxtools" == e && "" === $("#fxtools_color").val() && $("#fxtools_color").val("#a61c00").trigger("change-silent"),
				$("#floatingtoolbar").trigger("blur")
		} else {
			$("#secondary-toolbar").hide();
			$("#floatingtoolbar").trigger("blur");
		}
		// END MOD
	};
	// END ROLL20 CODE

	d20plus.mod.drawMeasurements = function () {
		// BEGIN ROLL20 CODE
		var E = function(e, t) {
			let n = {
				scale: 0,
				grid: 0
			}
				, i = 0
				, o = -1;
			_.each(t.waypoints, r=>{
					let a = {
						to_x: r[0],
						to_y: r[1],
						color: t.color,
						flags: t.flags,
						hide: t.hide
					};
					o > -1 ? (a.x = t.waypoints[o][0],
						a.y = t.waypoints[o][1]) : (a.x = t.x,
						a.y = t.y);
					let s = S(e, a, !0, "nub", n, i);
					n.scale += s.scale_distance,
						n.grid += s.grid_distance,
						i = s.diagonals % 2,
						++o
				}
			);
			let r = {
				to_x: t.to_x,
				to_y: t.to_y,
				color: t.color,
				flags: t.flags,
				hide: t.hide,
				Ve: t.Ve
			};
			-1 === o ? (r.x = t.x,
				r.y = t.y) : (r.x = t.waypoints[o][0],
				r.y = t.waypoints[o][1]),
				S(e, r, !0, "arrow", n, i)
		}

		var S = function(e, t, n, i, o, r) {
			let a = e=>e / d20.engine.canvasZoom
				, s = d20.engine.getDistanceInScale({
				x: t.x,
				y: t.y
			}, {
				x: t.to_x,
				y: t.to_y
			}, r, 15 & t.flags);
			e.globalCompositeOperation = "source-over",
				e.strokeStyle = t.color,
				e.fillStyle = e.strokeStyle,
				e.lineWidth = a(3);
			let l = {
				line: [t.to_x - t.x, t.to_y - t.y],
				arrow: [[-10.16, -24.53], [0, -20.33], [10.16, -24.53]],
				x: [1, 0],
				y: [0, 1]
			};
			if (e.beginPath(),
				e.moveTo(t.x, t.y),
				e.lineTo(t.to_x, t.to_y),
			!0 === i || "arrow" === i) {
				let n = Math.atan2(l.line[1], l.line[0]);
				l.forward = [Math.cos(n), Math.sin(n)],
					l.right = [Math.cos(n + Math.PI / 2), Math.sin(n + Math.PI / 2)],
					l.arrow = _.map(l.arrow, e=>[d20.math.dot(e, l.right), d20.math.dot(e, l.forward)]),
					l.arrow = _.map(l.arrow, e=>[d20.math.dot(e, l.x), d20.math.dot(e, l.y)]),
					e.moveTo(t.to_x, t.to_y),
					_.each(l.arrow, n=>e.lineTo(t.to_x + a(n[0]), t.to_y + a(n[1]))),
					e.closePath(),
					e.fill()
			}
			if (e.closePath(),
				e.stroke(),
			"nub" === i && (e.beginPath(),
				e.arc(t.to_x, t.to_y, a(7), 0, 2 * Math.PI, !0),
				e.closePath(),
				e.fill()),
				n) {
				let n = Math.round(a(16))
					, i = Math.round(a(14));
				e.font = `${n}px Arial Black`,
					e.textBaseline = "alphabetic",
					e.textAlign = "center";
				let r = {
					distance: Math.round(10 * (s.scale_distance + (o ? o.scale : 0))) / 10,
					units: d20.Campaign.activePage().get("scale_units")
				};
				r.text = `${r.distance} ${r.units}`,
					r.text_metrics = e.measureText(r.text);
				let l = {
					active: d20.Campaign.activePage().get("showgrid") && d20.engine.snapTo > 0 && "sq" !== r.units && "hex" !== r.units,
					text: ""
				};
				if (l.active) {
					let t = d20.Campaign.activePage().get("grid_type")
						, n = "hex" === t || "hexr" === t ? "hex" : "sq";
					e.font = `${i}px Arial`,
						l.distance = Math.round(10 * (s.grid_distance + (o ? o.grid : 0))) / 10,
						l.text = `${l.distance} ${n}`,
						l.text_metrics = e.measureText(l.text)
				}
				let c = n - Math.round(a(4))
					, u = i - Math.round(a(3.5))
					, d = {
					x: t.to_x - Math.round(a(35)),
					y: t.to_y - Math.round(a(35)),
					width: Math.max(r.text_metrics.width, l.active ? l.text_metrics.width : 0),
					height: c,
					padding: Math.round(a(5)),
					scale_baseline_offset: 0,
					cell_baseline_offset: 0,
					text_horizontal_offset: 0,
					line_spacing: Math.ceil(a(4)),
					image_width: a(20),
					image_height: a(20),
					image_padding_left: a(5)
				};
				d.height += 2 * d.padding,
					d.width += 2 * d.padding,
					d.text_horizontal_offset = .5 * d.width,
					d.scale_baseline_offset = d.height - d.padding,
				l.active && (d.height += u + d.line_spacing,
					d.cell_baseline_offset = d.height - d.padding),
				t.hide && (d.width += d.image_width + d.image_padding_left,
					d.height = Math.max(d.height, d.image_height + 2 * d.padding),
					d.text_width = Math.max(r.text_metrics.width, l.active ? l.text_metrics.width : 0)),
					e.fillStyle = "rgba(255,255,255,0.75)",
					e.fillRect(d.x, d.y, d.width, d.height),
					e.fillStyle = "rgba(0,0,0,1)",
					e.font = `${n}px Arial Black`,
					e.fillText(r.text, d.x + d.text_horizontal_offset, d.y + d.scale_baseline_offset),
					e.font = `${i}px Arial`,
					e.fillText(l.text, d.x + d.text_horizontal_offset, d.y + d.cell_baseline_offset),
				t.hide && (d.image_vertical_offset = .5 * d.height - .5 * d.image_height,
					d.image_horizontal_offset = d.padding + d.text_width + d.image_padding_left,
					e.drawImage($("#measure li.rulervisibility[mode='hide'] > img")[0], d.x + d.image_horizontal_offset, d.y + d.image_vertical_offset, d.image_width, d.image_height))
			}

			// BEGIN MOD
			if (t.Ve) {
				const RAD_90_DEG = 1.5708;

				const euclid = (x1, y1, x2, y2) => {
					const a = x1 - x2;
					const b = y1 - y2;
					return Math.sqrt(a * a + b * b)
				};

				const rotPoint = (angleRad, pX, pY) => {
					const s = Math.sin(angleRad);
					const c = Math.cos(angleRad);

					pX -= t.x;
					pY -= t.y;

					const xNew = pX * c - pY * s;
					const yNew = pX * s + pY * c;

					pX = xNew + t.x;
					pY = yNew + t.y;
					return [pX, pY];
				};

				const getLineEquation = (x1, y1, x2, y2) => {
					const getM = () => {
						return (y2 - y1) / (x2 - x1)
					};
					const m = getM();

					const getC = () => {
						return y1 - (m * x1);
					};

					const c = getC();

					return {
						fn: (x) => (m * x) + c,
						m, c
					}
				};

				const getPerpLineEquation = (x, y, line) => {
					const m2 = -1 / line.m
					const c2 = y - (m2 * x);
					return {
						fn: (x) => (m2 * x) + c2,
						m: m2, c: c2
					}
				};

				const getIntersect = (pointPerp, line1, line2) => {
					if (Math.abs(line1.m) === Infinity) {
						// intersecting with the y-axis...
						return [pointPerp[0], line2.fn(pointPerp[0])];
					} else {
						const x = (line2.c - line1.c) / (line1.m - line2.m);
						const y = line1.fn(x);
						return [x, y];
					}
				};

				switch (t.Ve.mode) {
					case "1": // standard ruler
						break;
					case "2": { // radius
						const drawCircle = (cx, cy, rad) => {
							e.beginPath();
							e.arc(cx, cy, rad, 0, 2*Math.PI);
							e.stroke();
							e.closePath();
						};

						switch (t.Ve.radius.mode) {
							case "1": // origin
								drawCircle(t.x, t.y, euclid(t.x, t.y, t.to_x, t.to_y));
								break;
							case "2": { // halfway
								const dx = t.to_x - t.x;
								const dy = t.to_y - t.y;
								const cX = t.x + (dx / 2);
								const cY = t.y + (dy / 2);

								drawCircle(cX, cY, euclid(cX, cY, t.to_x, t.to_y));
								break;
							}
						}

						break;
					}
					case "3": { // cone
						const arcRadians = (Number(t.Ve.cone.arc) || 0.017) / 2; // 1 degree minimum

						const r = euclid(t.x, t.y, t.to_x, t.to_y);
						const dx = t.to_x - t.x;
						const dy = t.to_y - t.y;
						const startR = Math.atan2(dy, dx);

						if (t.Ve.cone.mode === "1") {
							const line = getLineEquation(t.x, t.y, t.to_x, t.to_y);
							const perpLine = getPerpLineEquation(t.to_x, t.to_y, line);

							const pRot1 = rotPoint(arcRadians, t.to_x, t.to_y);
							const lineRot1 = getLineEquation(t.x, t.y, pRot1[0], pRot1[1]);
							const intsct1 = getIntersect([t.to_x, t.to_y], perpLine, lineRot1);

							// border line 1
							e.beginPath();
							e.moveTo(t.x, t.y);
							e.lineTo(intsct1[0], intsct1[1]);
							e.stroke();
							e.closePath();

							// perp line 1
							e.beginPath();
							e.moveTo(t.to_x, t.to_y);
							e.lineTo(intsct1[0], intsct1[1]);
							e.stroke();
							e.closePath();

							const pRot2 = rotPoint(-arcRadians, t.to_x, t.to_y);
							const lineRot2 = getLineEquation(t.x, t.y, pRot2[0], pRot2[1]);
							const intsct2 = getIntersect([t.to_x, t.to_y], perpLine, lineRot2);

							// border line 2
							e.beginPath();
							e.moveTo(t.x, t.y);
							e.lineTo(intsct2[0], intsct2[1]);
							e.stroke();
							e.closePath();

							// perp line 2
							e.beginPath();
							e.moveTo(t.to_x, t.to_y);
							e.lineTo(intsct2[0], intsct2[1]);
							e.stroke();
							e.closePath();
						} else {
							// arc 1
							e.beginPath();
							e.arc(t.x, t.y, r, startR, startR + arcRadians);
							e.stroke();
							e.closePath();
							// arc 2
							e.beginPath();
							e.arc(t.x, t.y, r, startR, startR - arcRadians, true); // draw counter-clockwise
							e.stroke();
							e.closePath();

							// border line 1
							const s1 = Math.sin(arcRadians);
							const c1 = Math.cos(arcRadians);
							const xb1 = dx * c1 - dy * s1;
							const yb1 = dx * s1 + dy * c1;
							e.beginPath();
							e.moveTo(t.x, t.y);
							e.lineTo(t.x + xb1, t.y + yb1);
							e.stroke();
							e.closePath();

							// border line 2
							const s2 = Math.sin(-arcRadians);
							const c2 = Math.cos(-arcRadians);
							const xb2 = dx * c2 - dy * s2;
							const yb2 = dx * s2 + dy * c2;
							e.beginPath();
							e.moveTo(t.x, t.y);
							e.lineTo(t.x + xb2, t.y + yb2);
							e.stroke();
							e.closePath();
						}
						break;
					}
					case "4": { // box
						const dxHalf = (t.to_x - t.x) / 2;
						const dyHalf = (t.to_y - t.y) / 2;

						e.beginPath();
						switch (t.Ve.box.mode) {
							case "1": // origin
								const dx = t.to_x - t.x;
								const dy = t.to_y - t.y;

								const [x1, y1] = rotPoint(RAD_90_DEG, t.to_x, t.to_y);
								const [x3, y3] = rotPoint(-RAD_90_DEG, t.to_x, t.to_y);

								e.moveTo(x1, y1);
								e.lineTo(x1 + dx, y1 + dy);
								e.lineTo(x3 + dx, y3 + dy);
								e.lineTo(x3 - dx, y3 - dy);
								e.lineTo(x1 - dx, y1 - dy);
								e.lineTo(x1 + dx, y1 + dy);

								break;
							case "2": { // halfway
								const [x1, y1] = rotPoint(RAD_90_DEG, t.to_x - dxHalf, t.to_y - dyHalf);
								const [x3, y3] = rotPoint(-RAD_90_DEG, t.to_x - dxHalf, t.to_y - dyHalf);

								e.moveTo(t.x, t.y);
								e.lineTo(x1, y1);
								e.lineTo(x3, y3);

								const dx3 = (x3 - t.x);
								const dy3 = (y3 - t.y);
								e.lineTo(t.to_x + dx3, t.to_y + dy3);

								const dx1 = (x1 - t.x);
								const dy1 = (y1 - t.y);
								e.lineTo(t.to_x + dx1, t.to_y + dy1);

								e.lineTo(x1, y1);

								break;
							}
						}
						e.stroke();
						e.closePath();
						break;
					}
					case "5": { // line
						e.beginPath();

						const div = t.Ve.line.mode === "2" ? 1 : 2;

						const norm = [];
						d20plus.math.normalize(norm, [t.to_x - t.x, t.to_y - t.y]);
						const width = (Number(t.Ve.line.width) || 0.1) / div;
						const scaledWidth = (width / d20.Campaign.activePage().get("scale_number")) * 70;
						d20plus.math.scale(norm, norm, scaledWidth);

						const xRot = t.x + norm[0];
						const yRot = t.y + norm[1];

						const [x1, y1] = rotPoint(RAD_90_DEG, xRot, yRot);
						const [x3, y3] = rotPoint(-RAD_90_DEG, xRot, yRot);
						console.log(t.x, t.y, norm, xRot, yRot);

						e.moveTo(t.x, t.y);
						e.lineTo(x1, y1);
						e.lineTo(x3, y3);

						const dx3 = (x3 - t.x);
						const dy3 = (y3 - t.y);
						e.lineTo(t.to_x + dx3, t.to_y + dy3);

						const dx1 = (x1 - t.x);
						const dy1 = (y1 - t.y);
						e.lineTo(t.to_x + dx1, t.to_y + dy1);

						e.lineTo(x1, y1);

						e.stroke();
						e.closePath();
						break;
					}
				}
			}
			// END MOD

			return s
		};

		d20.engine.drawMeasurements = function (e) {
			e.globalCompositeOperation = "source-over",
				e.globalAlpha = 1,
				_.each(d20.engine.measurements, function(t) {
					if (t.pageid !== d20.Campaign.activePage().id)
						return;
					let n = {
						color: d20.Campaign.players.get(t.player).get("color"),
						to_x: t.to_x - d20.engine.currentCanvasOffset[0],
						to_y: t.to_y - d20.engine.currentCanvasOffset[1],
						x: t.x - d20.engine.currentCanvasOffset[0],
						y: t.y - d20.engine.currentCanvasOffset[1],
						flags: t.flags,
						hide: t.hide,
						waypoints: _.map(t.waypoints, e=>[e[0] - d20.engine.currentCanvasOffset[0], e[1] - d20.engine.currentCanvasOffset[1]])
						// BEGIN MOD
						,
						Ve: t.Ve ? JSON.parse(JSON.stringify(t.Ve)) : undefined
						// END MOD
					};
					E(e, n)
				})

			// BEGIN MOD
			const offset = (num, offset, xy) => {
				return (num + offset[xy]) - d20.engine.currentCanvasOffset[xy];
			};

			// unrelated code, but throw it in the render loop here
			let doRender = false;
			$.each(d20plus.engine._tempTopRenderLines, (id, toDraw) => {
				console.log("DRAWING", toDraw.ticks, toDraw.offset)
				e.beginPath();
				e.strokeStyle = window.currentPlayer.get("color");
				e.lineWidth = 2;

				const nuX = offset(toDraw.x - d20.engine.currentCanvasOffset[0], toDraw.offset, 0);
				const nuY = offset(toDraw.y - d20.engine.currentCanvasOffset[1], toDraw.offset, 1);
				const nuToX = offset(toDraw.to_x - d20.engine.currentCanvasOffset[0], toDraw.offset, 0);
				const nuToY = offset(toDraw.to_y - d20.engine.currentCanvasOffset[1], toDraw.offset, 1);

				e.moveTo(nuX, nuY);
				e.lineTo(nuToX, nuToY);

				e.moveTo(nuToX, nuY);
				e.lineTo(nuX, nuToY);

				e.stroke();
				e.closePath();

				toDraw.ticks--;
				doRender = true;
				if (toDraw.ticks <= 0) {
					delete d20plus.engine._tempTopRenderLines[id];
				}
			});
			if (doRender) {
				d20.engine.debounced_renderTop()
			}
			// END MOD
		}
		// END ROLL20 CODE
	};

	d20plus.mod.overwriteStatusEffects = function () {
		d20.engine.canvasDirty = true;
		d20.engine.canvasTopDirty = true;
		d20.engine.canvas._objects.forEach(it => {
			// avoid adding it to any objects that wouldn't have it to begin with
			if (!it.model || !it.model.view || !it.model.view.updateBackdrops) return;

			// BEGIN ROLL20 CODE
			it.model.view.updateBackdrops = function (e) {
				if (!this.nohud && ("objects" == this.model.get("layer") || "gmlayer" == this.model.get("layer")) && "image" == this.model.get("type") && this.model && this.model.collection && this.graphic) {
					// BEGIN MOD
					const scaleFact = (d20plus.cfg.getCfgVal("canvas", "scaleNamesStatuses") && d20.Campaign.activePage().get("snapping_increment"))
						? d20.Campaign.activePage().get("snapping_increment")
						: 1;
					// END MOD
					var t = this.model.collection.page
						, n = e || d20.engine.canvas.getContext();
					n.save(),
					(this.graphic.get("flipX") || this.graphic.get("flipY")) && n.scale(this.graphic.get("flipX") ? -1 : 1, this.graphic.get("flipY") ? -1 : 1);
					var i = this
						, r = Math.floor(this.graphic.get("width") / 2)
						, o = Math.floor(this.graphic.get("height") / 2)
						, a = (parseFloat(t.get("scale_number")),
						this.model.get("statusmarkers").split(","));
					-1 !== a.indexOf("dead") && (n.strokeStyle = "rgba(189,13,13,0.60)",
						n.lineWidth = 10,
						n.beginPath(),
						n.moveTo(-r + 7, -o + 15),
						n.lineTo(r - 7, o - 5),
						n.moveTo(r - 7, -o + 15),
						n.lineTo(-r + 7, o - 5),
						n.closePath(),
						n.stroke()),
						n.rotate(-this.graphic.get("angle") * Math.PI / 180),
						n.strokeStyle = "rgba(0,0,0,0.65)",
						n.lineWidth = 1;
					var s = 0
						, l = i.model.get("bar1_value")
						, c = i.model.get("bar1_max");
					if ("" != c && (window.is_gm || this.model.get("showplayers_bar1") || this.model.currentPlayerControls() && this.model.get("playersedit_bar1"))) {
						var u = parseInt(l, 10) / parseInt(c, 10)
							, d = -o - 20 + 0;
						n.fillStyle = "rgba(" + d20.Campaign.tokendisplay.bar1_rgb + ",0.75)",
							n.beginPath(),
							n.rect(-r + 3, d, Math.floor((2 * r - 6) * u), 8),
							n.closePath(),
							n.fill(),
							n.beginPath(),
							n.rect(-r + 3, d, 2 * r - 6, 8),
							n.closePath(),
							n.stroke(),
							s++
					}
					var l = i.model.get("bar2_value")
						, c = i.model.get("bar2_max");
					if ("" != c && (window.is_gm || this.model.get("showplayers_bar2") || this.model.currentPlayerControls() && this.model.get("playersedit_bar2"))) {
						var u = parseInt(l, 10) / parseInt(c, 10)
							, d = -o - 20 + 12;
						n.fillStyle = "rgba(" + d20.Campaign.tokendisplay.bar2_rgb + ",0.75)",
							n.beginPath(),
							n.rect(-r + 3, d, Math.floor((2 * r - 6) * u), 8),
							n.closePath(),
							n.fill(),
							n.beginPath(),
							n.rect(-r + 3, d, 2 * r - 6, 8),
							n.closePath(),
							n.stroke(),
							s++
					}
					var l = i.model.get("bar3_value")
						, c = i.model.get("bar3_max");
					if ("" != c && (window.is_gm || this.model.get("showplayers_bar3") || this.model.currentPlayerControls() && this.model.get("playersedit_bar3"))) {
						var u = parseInt(l, 10) / parseInt(c, 10)
							, d = -o - 20 + 24;
						n.fillStyle = "rgba(" + d20.Campaign.tokendisplay.bar3_rgb + ",0.75)",
							n.beginPath(),
							n.rect(-r + 3, d, Math.floor((2 * r - 6) * u), 8),
							n.closePath(),
							n.fill(),
							n.beginPath(),
							n.rect(-r + 3, d, 2 * r - 6, 8),
							n.closePath(),
							n.stroke()
					}
					var h, p, g = 1, f = !1;
					switch (d20.Campaign.get("markers_position")) {
						case "bottom":
							h = o - 10,
								p = r;
							break;
						case "left":
							h = -o - 10,
								p = -r,
								f = !0;
							break;
						case "right":
							h = -o - 10,
								p = r - 18,
								f = !0;
							break;
						default:
							h = -o + 10,
								p = r
					}
					// BEGIN MOD
					n.strokeStyle = "white";
					n.lineWidth = 3 * scaleFact;
					const scaledFont = 14 * scaleFact;
					n.font = "bold " + scaledFont + "px Arial";
					// END MOD
					_.each(a, function (e) {
						var t = d20.token_editor.statusmarkers[e.split("@")[0]];
						if (!t)
							return !0;
						if ("dead" === e)
							return !0;
						var i = 0;
						if (g--,
						"#" === t.substring(0, 1))
							n.fillStyle = t,
								n.beginPath(),
								f ? h += 16 : p -= 16,
								n.arc(p + 8, f ? h + 4 : h, 6, 0, 2 * Math.PI, !0),
								n.closePath(),
								n.stroke(),
								n.fill(),
								i = f ? 10 : 4;
						else {
							// BEGIN MOD
							if (!d20.token_editor.statussheet_ready) return;
							const scaledWH = 21 * scaleFact;
							const scaledOffset = 22 * scaleFact;
							f ? h += scaledOffset : p -= scaledOffset;

							if (d20.engine.canvasZoom <= 1) {
								n.drawImage(d20.token_editor.statussheet_small, parseInt(t, 10), 0, 21, 21, p, h - 9, scaledWH, scaledWH);
							} else {
								n.drawImage(d20.token_editor.statussheet, parseInt(t, 10), 0, 24, 24, p, h - 9, scaledWH, scaledWH)
							}

							i = f ? 14 : 12;
							i *= scaleFact;
							// END MOD
						}
						if (-1 !== e.indexOf("@")) {
							var r = e.split("@")[1];
							// BEGIN MOD
							// bing backtick to "clear counter"
							if (r === "`") return;
							n.fillStyle = "rgb(222,31,31)";
							var o = f ? 9 : 14;
							o *= scaleFact;
							o -= (14 - (scaleFact * 14));
							n.strokeText(r + "", p + i, h + o);
							n.fillText(r + "", p + i, h + o);
							// END MOD
						}
					});
					var m = i.model.get("name");
					if ("" != m && 1 == this.model.get("showname") && (window.is_gm || this.model.get("showplayers_name") || this.model.currentPlayerControls() && this.model.get("playersedit_name"))) {
						n.textAlign = "center";
						// BEGIN MOD
						var y = 14 * scaleFact;
						const scaledY = 22 * scaleFact;
						const scaled6 = 6 * scaleFact;
						const scaled8 = 8 * scaleFact;
						n.font = "bold " + y + "px Arial";
						var v = n.measureText(m).width;
						n.fillStyle = "rgba(255,255,255,0.50)";
						n.fillRect(-1 * Math.floor((v + scaled6) / 2), o + scaled8, v + scaled6, y + scaled6);
						n.fillStyle = "rgb(0,0,0)";
						n.fillText(m + "", 0, o + scaledY, v);
						// END MOD
					}
					n.restore()
				}
			}
			// END ROLL20 CODE
		});
	};

	d20plus.mod.mouseEnterMarkerMenu = function () {
		var e = this;
		$(this).on("mouseover.statusiconhover", ".statusicon", function () {
			a = $(this).attr("data-action-type").replace("toggle_status_", "")
		}),
			$(document).on("keypress.statusnum", function (t) {
				// BEGIN MOD // TODO see if this clashes with keyboard shortcuts
				if ("dead" !== a && currentcontexttarget) {
					// END MOD
					var n = String.fromCharCode(t.which)
						,
						i = "" == currentcontexttarget.model.get("statusmarkers") ? [] : currentcontexttarget.model.get("statusmarkers").split(",")
						, r = (_.map(i, function (e) {
							return e.split("@")[0]
						}),
							!1);
					i = _.map(i, function (e) {
						return e.split("@")[0] == a ? (r = !0,
						a + "@" + n) : e
					}),
					r || ($(e).find(".statusicon[data-action-type=toggle_status_" + a + "]").addClass("active"),
						i.push(a + "@" + n)),
						currentcontexttarget.model.save({
							statusmarkers: i.join(",")
						})
				}
			})
	};
}

SCRIPT_EXTENSIONS.push(d20plusMod);