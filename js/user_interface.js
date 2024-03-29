function br(parent){
    let blank = document.createElement("br");
    parent.appendChild(blank);
}

function add_select(parent, options, title, selectfunc){
    let select = document.createElement( 'select' );

    let option = document.createElement('option');
    option.textContent = title;
    option.value = null;
    option.disabled = true;
    option.selected = true;
    select.appendChild(option) ;

    for (let i = 0; i < options.length; i++) {
        let option = document.createElement('option');
        option.textContent = options[i][0];
        option.value = options[i][1];
        select.appendChild(option) ;
    }

    select.addEventListener( 'change', function (event) {
        selectfunc(event);
        select.blur();
    });

    parent.appendChild(select);
}

function add_button(parent, buttontext, buttonfunc){
    let f = document.createElement('button');
    f.textContent = buttontext;
    f.addEventListener('click', function(event){
        event.preventDefault();
        buttonfunc();
        f.blur();
    });
    parent.appendChild( f );
}

function add_a(parent, buttontext, buttonfunc){
    let f = document.createElement('a');
    f.textContent = buttontext;
    f.addEventListener('click', function(event){
        event.preventDefault();
        buttonfunc();
    });
    parent.appendChild( f );
}

function add_dropdown(parent, title){
    let dd = document.createElement( 'div' );
    dd.className = 'dropdown';

    let ddbtn = document.createElement('button');
    ddbtn.className = 'dropbtn';
    ddbtn.textContent = title;
    dd.appendChild(ddbtn);

    let ddc = document.createElement('div');
    ddc.className = 'dropdown-content';
    ddc.id = title;
    dd.appendChild(ddc) ;

    parent.appendChild(dd);
    return ddc;
}

function add_option(parent, title, f){
    let option = document.createElement('a');
    option.textContent = title;
    option.onclick = f
    parent.appendChild(option);
    return option
}

function add_options(parent, options){
    for (i = 0; i < options.length; i++){
        add_option(parent, options[i][0], options[i][1])
    }
}

function add_submenu(parent, title, f){
    let submenu = document.createElement('div');
    submenu.className = 'dropdown-submenu';

    let subbtn = document.createElement('a');
    subbtn.textContent = title;
    subbtn.onclick = f;
    submenu.appendChild(subbtn);

    let submenucontent = document.createElement('div');
    submenucontent.className = 'dropdown-content';
    submenu.appendChild(submenucontent)


    parent.appendChild(submenu)
    return submenucontent
}

function add_slider(min, max, step, defaultval, size, f){
    let slider = document.createElement("input");
    slider.className = 'slider';
    slider.type = 'range';
    slider.min = min;
    slider.max = max;
    slider.step = step;
    slider.defaultValue = defaultval;
    slider.style.width = size[0];
    slider.style.height = size[1];
    slider.oninput = f;
    document.body.appendChild(slider);
    return slider;
}

function add_form(parent, fieldname, fieldval, buttontext, buttonfunc){
    let f = document.createElement('form');

    let i = document.createElement("input");
    i.setAttribute('type',"text");
    i.setAttribute('id',fieldname);
    i.setAttribute('value',fieldval);

    let s = document.createElement('button');
    s.setAttribute('type',"submit");
    s.textContent = buttontext;

    f.addEventListener('submit', function(event){
        event.preventDefault();
        buttonfunc(fieldname);
        i.blur();
    });

    f.appendChild( i );
    f.appendChild( s );
    parent.appendChild( f );
}

function first(f){
    d = new $.Deferred();
    setTimeout(f + 'd.resolve()', 0);
    return d.promise()
}

function second(f){
    d = new $.Deferred();
    setTimeout(f +  'd.resolve()', 10);
    return d.promise()
}

function force_order(f1, f2){
    promise = first(f1).then(second(f2));
}

function init_ui() {
    let menubar = document.createElement('div');
    menubar.id = "menubar";
    menubar.className = "container";
    menubar.style.position = 'absolute';
    menubar.style.top = '0px';
    menubar.style.left = '0px';
    document.body.appendChild( menubar );

    add_button(menubar, "Next",() => {
        if (cursor === 3) {
            if (tree.length !== vertices.length - 1)
                return
            let es = new Set();
            tree.forEach(e => {
                es.add(e.v_1);
                es.add(e.v_2);
            });
            if (vertices.length !== es.size || !sink)
                return
        }
        cursor += 1;
        window.removeEventListener('mousedown', onMouseDown);
        modals[cursor + 1].classList.add("open");
    });

    // add_button(menubar, "Vertex", function() {
    //     cursor = 0;
    // });
    // add_button(menubar, "Edge", function () {
    //     cursor = 1;
    // })
    // add_button(menubar, "Sink", function () {
    //     cursor = 2;
    // })
    // add_button(menubar, "Chip", function () {
    //     cursor = 4;
    // })
    // add_button(menubar, "Tree", function () {
    //     cursor = 3;
    //     if (!tree_active) {
    //         add_button(menubar, "Confirm", function () {
    //             if (tree.length !== vertices.length - 1)
    //                 return
    //             let es = new Set();
    //             tree.forEach(e => {
    //                 es.add(e.v_1);
    //                 es.add(e.v_2);
    //             });
    //             if (vertices.length !== es.size || !sink)
    //                 return
    //             add_button(menubar, "Rotor Route", route)
    //             for (let i = 0; i < menubar.children.length; i++) {
    //                 if (menubar.children[i].textContent === "Confirm") {
    //                     menubar.removeChild(menubar.children[i])
    //                 }
    //             }
    //         })
    //     }
    //     tree_active = true;
    // })
}

function route() {
    vertices.forEach(v => {
        v.orderCycord()
    })
    setRotors();
    renderer.render(scene, camera);
    rotorRouting();
}

function animate() {
    if (t < total_frames-1) {
        requestAnimationFrame(animate);
    }
    else {
        setTimeout(() => {
            modals[7].classList.add("open")
        }, 5000);
    }

    let chip_index = 0;
    let temp = t - f_per_op - (firings[0] * f_per_op * 2);
    while (temp >= 0) {
        chip_index += 1
        temp = temp - (firings[chip_index] * f_per_op * 2);
    }
    let chip = chips[chip_index]
    let tailv = chip.vertex;
    if (t < f_per_op) {
        if (t === Math.floor(f_per_op / 2)) {
            vertices.forEach(v => {
                if (v.id !== sink_vertex.id)
                    v.drawRotor()
            });
            renderer.render(scene, camera);
        }
    }
    else {
        let frame = t % f_per_op
        if (Math.floor(t / f_per_op) % 2 === 1) {
            if (frame === 0) {
                oldv = tailv.cycord[tailv.rotorpos];
                tailv.rotorpos = tailv.rotorpos + 1
                if (tailv.rotorpos === tailv.cycord.length) {
                    tailv.rotorpos = 0;
                    newv = tailv.cycord[tailv.rotorpos];
                }
                else {
                    parent.parent.oldv = tailv.cycord[tailv.rotorpos - 1];
                    newv = tailv.cycord[tailv.rotorpos];
                }

            }
            let x1 = oldv.center.x - tailv.center.x;
            let y1 = oldv.center.y - tailv.center.y;
            let x2 = newv.center.x - tailv.center.x;
            let y2 = newv.center.y - tailv.center.y;
            let [r1, theta1] = cart2pol(x1, y1);
            let [r2, theta2] = cart2pol(x2, y2);

            if (theta2 > theta1) {
                theta1 += 2*Math.PI;
            }
            animateRotor(frame, tailv, r1, theta1, r2, theta2)
            renderer.render(scene, camera);
        }
        else {
            let headv = tailv.cycord[tailv.rotorpos];
            let x1 = tailv.center.x
            let y1 = tailv.center.y
            let x2 = headv.center.x
            let y2 = headv.center.y
            animateChip(frame, chip, x1, y1, x2, y2);
            if (frame === f_per_op - 1) {
                chip.vertex = headv;
                if (headv === sink_vertex) {
                    chip.mesh.material.visisble = false;
                }
            }
            renderer.render(scene, camera);
        }

    }

    t+=1

}

function rotorRouting() {
    firings = numFirings(vertices, cverts, sink_vertex);
    total_operations = firings.reduce((partialSum, a) => partialSum + a, 0) * 2 + 1
    total_frames = f_per_op * total_operations;

    animate();
}

function animateRotor(frame, v, r1, theta1, r2, theta2) {
    let r = (1 - frame / (f_per_op - 1)) * r1 + (frame / (f_per_op - 1)) * r2;
    let theta = (1 - frame / (f_per_op - 1)) * theta1 + (frame / (f_per_op - 1)) * theta2;

    let norm_vector = new THREE.Vector3(0, 0, 1);
    let direction = new THREE.Vector3(1, 0, 0);
    direction.applyAxisAngle(norm_vector, theta)
    v.rotor.setDirection(direction.normalize());
    v.rotor.setLength(r, 2, 2)

}

function animateChip(frame, chip, x1, y1, x2, y2) {
    let dx = (x1 * (1-frame/(f_per_op - 1)) + x2 * (frame/(f_per_op - 1)));
    let dy = (y1 * (1-frame/(f_per_op - 1)) + y2 * (frame/(f_per_op - 1)));
    chip.updatePosition(dx, dy);
}

function numFirings() {
    vertices.forEach(v => {
        v.temppos = v.rotorpos
    });
    let firings = new Array(cverts.length).fill(0);
    for (let w = 0; w < cverts.length; w++) {
        while (cverts[w].id !== sink_vertex.id)
        {
            firings[w] = firings[w] + 1
            cverts[w].temppos = cverts[w].temppos + 1
            if (cverts[w].temppos === cverts[w].cycord.length) {
                cverts[w].temppos = 0
            }
            cverts[w] = cverts[w].cycord[cverts[w].temppos]
        }
    }
    return firings
}

function setRotors() {
    const assigned = [sink_vertex];
    let temp_edges = [...tree];
    let failed = false;
    while (temp_edges.length > 0 && failed === false) {
        let infinitecheck = true
        temp_edges.forEach(e => {
            e.mesh.material.color.set(0x808080);
            if (assigned.some(v => v.id === e.v_2.id)) {
                e.v_1.setFirst(e.v_2)
                assigned.push(e.v_1);
                let index = temp_edges.indexOf(e)
                temp_edges.splice(index, 1);
                infinitecheck = false;
            }
            else if (assigned.some(v => v.id === e.v_1.id)) {
                e.v_2.setFirst(e.v_1)
                assigned.push(e.v_2);
                let index = temp_edges.indexOf(e)
                temp_edges.splice(index, 1);
                infinitecheck = false;
            }
        });
        console.assert(infinitecheck === false, "Check your spanning tree");
        if (infinitecheck === true) {
            failed = true
        }

    }

}