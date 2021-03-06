/*
  This file is part of Cytoscape Web.
  Copyright (c) 2009, The Cytoscape Consortium (www.cytoscape.org)

  The Cytoscape Consortium is:
    - Agilent Technologies
    - Institut Pasteur
    - Institute for Systems Biology
    - Memorial Sloan-Kettering Cancer Center
    - National Center for Integrative Biomedical Informatics
    - Unilever
    - University of California San Diego
    - University of California San Francisco
    - University of Toronto

  This library is free software; you can redistribute it and/or
  modify it under the terms of the GNU Lesser General Public
  License as published by the Free Software Foundation; either
  version 2.1 of the License, or (at your option) any later version.

  This library is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
  Lesser General Public License for more details.

  You should have received a copy of the GNU Lesser General Public
  License along with this library; if not, write to the Free Software
  Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA
*/

// ===[ namespaces ]================================================================================

// Create namespaces if not already defined:
(function () {
    "use strict";

    if (!this.org) {
        this.org = {};
    }
    if (!this.org.cytoscapeweb) {
    	/** @namespace */
        this.org.cytoscapeweb = {};
    }

    // Create a global map to store all instances of Cytoscape Web:
    this._cytoscapeWebInstances = { index: 0 };

    // ===[ Visualization ]=========================================================================
    
    /**
     * <p>Initialize Cytoscape Web. It does not draw the network yet.</p>
     * <p>The {@link org.cytoscapeweb.Visualization#draw} method must be called when 
     * you want the network to be displayed.</p>
     * @example
     * &lt;html&gt;
     * &lt;head&gt; &lt;/head&gt;
     * &lt;body&gt;
     * 
     * &lt;h1&gt;Sample&lt;/h1&gt;
     * &lt;div id="cytoWebContent" style="width: 600px;height: 400px;"&gt;&lt;/div&gt;
     * 
     * &lt;script type="text/javascript"&gt;
     *     var options = { swfPath: "path/to/swf/CytoscapeWeb",
     *                     flashInstallerPath: "path/to/swf/playerProductInstall",
     *                     flashAlternateContent: "Le Flash Player est n&eacute;cessaire." };
     *                     
     *     var vis = new org.cytoscapeweb.Visualization("cytoWebContent", options);
     *     
     *     vis.draw({ network: '&lt;graphml&gt;...&lt;/graphml&gt;' });
     * &lt;/script&gt;
     *
     * &lt;/body&gt;
     * &lt;html&gt;
     * @class
     * @param {String} containerId The id of the HTML element (containing your alternative content)
     *                             you would like to have replaced by the Flash object.
     * @param {Object} [options] Cytoscape Web parameters:
     *                <ul>
     *                    <li><strong><code>swfPath</code></strong>: The path of the compiled Cytoscape Web SWF file, but without the
     *                                                               <code>.swf</code> extension. If you use the provided <code>CytoscapeWeb.swf</code>
     *                                                               file and put it in the root path of the web application, this option does not need
     *                                                               to be informed. But, for example, if you deploy the swf file at <code>/plugin/flash</code>,
     *                                                               the <code>swfPath</code> value must be "/plugin/flash/CytoscapeWeb".</li>
     *                    <li><strong><code>flashInstallerPath</code></strong>: The path to the compiled Flash video that should be displayed in case
     *                                                                          the browser does not have the Flash Player version required by Cytoscape Web.
     *                                                                          The default value is "playerProductInstall" and, if this option is not changed,
     *                                                                          the <code>playerProductInstall.swf</code> file must be deployed in the
     *                                                                          web site's root path. Otherwise, just inform the new path without the
     *                                                                          <code>.swf</code> extension.</li>
     *                    <li><strong><code>flashAlternateContent</code></strong>: The text message that should be displayed if the browser does not have
     *                                                                             the Flash Player plugin. If none is provided, Cytoscape Web will show
     *                                                                             a default message and a link to the "Get Flash" page.</li>
     *                    <li><strong><code>resourceBundleUrl</code></strong>: An optional resource bundle path. Usually a <code>.properties</code></strong> file
     *                                                                         that redefines the default labels and messages used by Cytoscape Web.
     *                                                                         Example of a valid file with all the available keys:
     * <pre>
     * global.wait = Please wait...
     * error.title = Error
     * pan.up.tooltip = Pan up
     * pan.down.tooltip = Pan down
     * pan.left.tooltip = Pan left
     * pan.right.tooltip = Pan right
     * zoom.out.tooltip = Zoom out (-)
     * zoom.in.tooltip = Zoom in (+)
     * zoom.fit.tooltip = Fit to screen (*)
     * zoom.slider.tooltip = {0}%
     * zoom.slider.datatip = {0}%
     * </pre></li>
     *                    <li><strong><code>idToken</code></strong>: A string used to create the embedded Flash video id
     *                                                               (usually an HTML <code>embed</code> or <code>object</code> tag).
     *                                                               The default token is "cytoscapeWeb" and the final id will be the token followed
     *                                                               by a number, so if the application has two instances of the Visualization in the same page,
     *                                                               their id's will be "cytoscapeWeb1" and "cytoscapeWeb2".
     *                                                               This token does not usually need to be changed.</li>
     *                </ul>
     * @return {org.cytoscapeweb.Visualization} The Visualization instance.
     * @see org.cytoscapeweb.Visualization#draw
     * @see org.cytoscapeweb.Visualization#ready
     */
    this.org.cytoscapeweb.Visualization = function (containerId, options) {
        this.containerId = containerId;

        if (!options) { options = {}; }
        this.options = options;

        // Part of the embed or object tag id:
        this.idToken = options.idToken ? options.idToken : "cytoscapeWeb";
        // The .swf path, including its name, but without the file extension:
        this.swfPath = options.swfPath ? options.swfPath : "CytoscapeWeb";
        // The path of the .swf file that updates the Flash player version:
        this.flashInstallerPath = options.flashInstallerPath ? options.flashInstallerPath : "playerProductInstall";
        // Alternate content to be displayed in case user does not have Flash installed:
        this.flashAlternateContent = options.flashAlternateContent ? options.flashAlternateContent : 'This content requires the Adobe Flash Player. ' +
                                                                                                     '<a href=http://www.adobe.com/go/getflash/>Get Flash</a>';
        _cytoscapeWebInstances.index++;

        this.id = this.idToken + _cytoscapeWebInstances.index;
        _cytoscapeWebInstances[this.id] = this;
    };

    org.cytoscapeweb.Visualization.prototype = {

        // PUBLIC METHODS:
        // -----------------------------------------------------------------------------------------

        /**
         * <p>Start Cytoscape Web by drawing the network.
         * At least the <code>network</code> option must be informed.</p>
         * @example
         * var vis = new org.cytoscapeweb.Visualization("container-id");
         * vis.draw({ network: '&lt;graphml&gt;...&lt;/graphml&gt;',
         *            edgeLabelsVisible: false,
         *            layout: 'Circle',
         *            visualStyle: {
         *                global: {
         *                    backgroundColor: "#000033",
         *                    nodeSelectionColor: "#ffce81"
         *                },
         *                nodes: {
         *                    shape: "diamond"
         *                },
         *                edges: {
         *                    width: 2
         *                }
         *            }
         *         });
         *
         * @description
         * <p>Just remember that you probably want to register a callback function with {@link org.cytoscapeweb.Visualization#ready}
         * before calling <code>draw()</code>.</p>
         * @example
         * var vis = new org.cytoscapeweb.Visualization("container-id");
         * vis.ready(function () {
         *     // Start interaction with the network here...
         * });
         * vis.draw({ network: '&lt;graphml&gt;...&lt;/graphml&gt;' });
         *
         * @param {Object} options
         *               <ul>Possible options:
         *                    <li><strong><code>network</code></strong>: The XML string that describes the network, either a
         *                                                               <a href="http://graphml.graphdrawing.org/primer/graphml-primer.html" target="_blank">GraphML</a>
         *                                                               or an <a href="http://www.cs.rpi.edu/~puninj/XGMML/" target="_blank">XGMML</a> format.</li>
         *                    <li><strong><code>visualStyle</code></strong>: an optional {@link org.cytoscapeweb.VisualStyle} object to be applied on this network.</li>
         *                    <li><strong><code>layout</code></strong>: an optional {@link org.cytoscapeweb.Layout} name to be applied on this network. The default is "ForceDirected"</li>
         *                    <li><strong><code>nodeLabelsVisible</code></strong>: Boolean that defines whether or not the node labels will be visible.
         *                                                                         The default value is <code>true</code>.
         *                                                                         You can call {@link org.cytoscapeweb.Visualization#nodeLabelsVisible} 
         *                                                                         later (after the network is ready) to change it.</li>
         *                    <li><strong><code>edgeLabelsVisible</code></strong>: Boolean that defines whether or not the edge labels will be visible.
         *                                                                         The default value is <code>false</code>.
         *                                                                         You can use {@link org.cytoscapeweb.Visualization#edgeLabelsVisible} later to change it.</li>
         *                    <li><strong><code>nodeTooltipsEnabled</code></strong>: Boolean value that enables or disables the node tooltips.
         *                                                                           The default value is <code>true</code>.
         *                                                                           You can call {@link org.cytoscapeweb.Visualization#nodeTooltipsEnabled} later to change it.</li>
         *                    <li><strong><code>edgeTooltipsEnabled</code></strong>: Boolean that enables or disables the edge tooltips.
         *                                                                           The default value is <code>true</code>.
         *                                                                           You can use {@link org.cytoscapeweb.Visualization#edgeTooltipsEnabled} later to change it.</li>
         *                    <li><strong><code>edgesMerged</code></strong>: Boolean that defines whether or not the network will be initially
         *                                                                   rendered with merged edges. The default value is <code>false</code>.
         *                                                                   You can call {@link org.cytoscapeweb.Visualization#edgesMerged} after the network is ready to change it.</li>
         *                    <li><strong><code>panZoomControlVisible</code></strong>: Boolean value that sets whether or not the built-in control
         *                                                                             will be visible. The default value is <code>true</code>.
         *                                                                             The visibility of the control can be changed later with
         *                                                                             {@link org.cytoscapeweb.Visualization#panZoomControlVisible}.</li>
         *                </ul>
         * @return {org.cytoscapeweb.Visualization} The Visualization instance.
         * @see org.cytoscapeweb.Visualization#ready
         * @see org.cytoscapeweb.VisualStyle
         * @see org.cytoscapeweb.Layout
         */
        draw: function (options) {
            if (!options) { options = {}; }
            this.drawOptions = options;
            // Start the Flash video:
            this.embedSWF();
            return this;
        },

        /**
         * <p>Register a function to be called after a {@link org.cytoscapeweb.Visualization#draw} method is executed and the visualization
         * is ready to receive requests, such as getting or selecting nodes, zooming, etc.</p>
         * <p>If the application wants to interact with the rendered network, this function must be used
         * before calling the <code>draw</code> method.</p>
         *
         * @example
         * // 1. Create the visualization instance:
         * var vis = new org.cytoscapeweb.Visualization("container-id");
         *
         * // 2. Register a callback function for the ready event:
         * vis.ready(function () {
         *     // Write code to interact with Cytoscape Web, e.g:
         *     var nodes = vis.nodes();
         *     // and so on...
         * });
         *
         * // 3. And then call draw:
         * vis.draw({ network: '&lt;graphml&gt;...&lt;/graphml&gt;' });
         *
         * @param {Function} fn The callback function that will be invoked after the network has been drawn
         *                      and the visualization is ready.
         * @return {org.cytoscapeweb.Visualization} The Visualization instance.
         * @see org.cytoscapeweb.Visualization#draw
         */
        ready: function (fn) {
            if (!fn) { this._onReady = function () {/*do nothing*/}; }
            else { this._onReady = fn; }
            return this;
        },

        /**
         * <p>If the <code>layoutName</code> argument is passed, it applies the layout to the network.
         * Otherwise it just returns the name of the current one.</p>
         *
         * @example
         * var vis = new org.cytoscapeweb.Visualization("container-id");
         * vis.draw({ network: '&lt;graphml&gt;...&lt;/graphml&gt;', layout: 'Circle' });
         *
         * // Get the current layout:
         * var layout = vis.layout(); // returns 'Circle'
         * // Apply a new layout:
         * vis.layout('ForceDirected');
         *
         * @param {org.cytoscapeweb.Layout} [layoutName] The layout name.
         * @return <ul><li>A current layout name for <code>layout()</code>.</li>
         *             <li>The Visualization object for <code>layout({String})</code>.</li></ul>
         * @see org.cytoscapeweb.Layout
         */
        layout: function (/*layoutName*/) {
            var swf = this.swf();
            if (arguments.length > 0) { swf.applyLayout(arguments[0]); return this; }
            else { return swf.getLayout(); }
        },

        /**
         * <p>If the <code>style</code> argument is passed, it applies that visual style to the network.
         * Otherwise it just returns the current visual style object.</p>
         * @param {org.cytoscapeweb.VisualStyle} [style] An object that contains the desired visual properties and attribute mappings.
         * @return <ul><li>The visual style object for <code>visualStyle()</code>.</li>
         *             <li>The Visualization object for <code>visualStyle({Object})</code>.</li></ul>
         * @see org.cytoscapeweb.VisualStyle
         * @see org.cytoscapeweb.Visualization#visualStyleBypass
         */
        visualStyle: function (/*style*/) {
            var swf = this.swf();
            if (arguments.length > 0) { swf.setVisualStyle(arguments[0]); return this; }
            else { return swf.getVisualStyle(); }
        },

        /**
         * <p>Set a visual style bypass on top of the existing visual style.</p>
         * <p>It allows you to override the visual styles and mappers for individual nodes and edges,
         * which is very useful when the default visual style mechanism is not enough to create the desired effect.</p>
         * 
         * @example
         * // Change the labels of selected nodes and edges:
         * var selected = vis.selected();
         * 
         * var bypass = { nodes: { }, edges: { } };
         * var props = { 
         *         labelFontSize: 16,
         *         labelFontColor: "#ff0000",
         *         labelFontWeight: "bold"
         * };
         * 
         * for (var i=0; i < selected.length; i++) {
         *     var obj = selected[i];
         *     
         *     // obj.group is either "nodes" or "edges"...
         *     bypass[obj.group][obj.data.id] = props;
         * }
         * 
         * vis.visualStyleBypass(bypass);
         * 
         * @example
         * // To remove a bypass, just set an empty object:
         * vis.visualStyleBypass({});
         *
         * @param {Object} bypass The visual properties for nodes and edges. Must be a map that has nodes/edges
         *                        ids as keys and the desired visual properties as values.
         *                        The visual properties are the same ones used by the VisualStyle objects, except that
         *                        <code>global</code> properties cannot be bypassed and are just ignored. Another difference is that you
         *                        cannot set visual mappers, but only static values.
         * @return {org.cytoscapeweb.Visualization} The Visualization instance.
         * @see org.cytoscapeweb.VisualStyle
         * @see org.cytoscapeweb.Visualization#visualStyle
         */
        visualStyleBypass: function (bypass) {
            this.swf().visualStyleBypass(bypass);
            return this;
        },

        /**
         * <p>If the boolean argument is passed, it shows or hides the built-in pan-zoom control.</p>
         * <p>If not, it just returns a boolean value indicating whether or not the control is visible.</p>
         * @param {Boolean} [visible] true to show it and false to hide it.
         * @return <ul><li>A boolean value for <code>panZoomControlVisible()</code>.</li>
         *             <li>The Visualization object for <code>panZoomControlVisible({Boolean})</code>.</li></ul>
         */
        panZoomControlVisible: function (/*visible*/) {
            var swf = this.swf();
            if (arguments.length > 0) { swf.showPanZoomControl(arguments[0]); return this; }
            else { return swf.isPanZoomControlVisible(); }
        },

        /**
         * <p>If the boolean argument is passed, it merges or unmerge all the edges and returns the Visualization object.</p>
         * <p>If not, it returns a boolean value indicating whether or not the edges are merged.</p>
         * @param {Boolean} [merged] true to merge the edges or false to unmerge them.
         * @return <ul><li>A boolean value for <code>edgesMerged()</code>.</li>
         *             <li>The Visualization object for <code>edgesMerged({Boolean})</code>.</li></ul>
         */
        edgesMerged: function (/*merged*/) {
            var swf = this.swf();
            if (arguments.length > 0) { swf.mergeEdges(arguments[0]); return this; }
            else { return swf.isEdgesMerged(); }
        },

        /**
         * <p>If the boolean argument is passed, it shows or hides all the node labels and returns the Visualization object.</p>
         * <p>If not, it returns a boolean value indicating whether or not the node labels are visible.</p>
         * @param {Boolean} [visible] true to show the labels or false to hide them.
         * @return <ul><li>A boolean value for <code>nodeLabelsVisible()</code>.</li>
         *             <li>The Visualization object for <code>nodeLabelsVisible({Boolean})</code>.</li></ul>
         */
        nodeLabelsVisible: function (/*visible*/) {
            var swf = this.swf();
            if (arguments.length > 0) { swf.showNodeLabels(arguments[0]); return this; }
            else { return swf.isNodeLabelsVisible(); }
        },

        /**
         * <p>If the boolean argument is passed, it shows or hides all the edge labels and returns the Visualization object.</p>
         * <p>If not, it returns a boolean value indicating whether or not the edge labels are visible.</p>
         * @param {Boolean} [visible] true to show the labels or false to hide them.
         * @return <ul><li>A boolean value for <code>edgeLabelsVisible()</code>.</li>
         *             <li>The Visualization object for <code>edgeLabelsVisible({Boolean})</code>.</li></ul>
         */
        edgeLabelsVisible: function (/*visible*/) {
            var swf = this.swf();
            if (arguments.length > 0) { swf.showEdgeLabels(arguments[0]); return this; }
            else { return swf.isEdgeLabelsVisible(); }
        },

        /**
         * <p>If the boolean argument is passed, it enables or disables the node tooltips.</p>
         * <p>If not, it returns a boolean value indicating whether or not the node tooltips are enabled.</p>
         * @param {Boolean} [enabled] true to enable the tooltips or false to disable them.
         * @return <ul><li>A boolean value for <code>nodeTooltipsEnabled()</code>.</li>
         *             <li>The Visualization object for <code>nodeTooltipsEnabled({Boolean})</code>.</li></ul>
         */
        nodeTooltipsEnabled: function (/*enabled*/) {
            var swf = this.swf();
            if (arguments.length > 0) { swf.enableNodeTooltips(arguments[0]); return this; }
            else { return swf.isNodeTooltipsEnabled(); }
        },

        /**
         * <p>If the boolean argument is passed, it enables or disables the edge tooltips.</p>
         * <p>If not, it returns a boolean value indicating whether or not the edge tooltips are enabled.</p>
         * @param {Boolean} [enabled] true to enable the tooltips or false to disable them.
         * @return <ul><li>A boolean value for <code>edgeTooltipsEnabled()</code>.</li>
         *             <li>The Visualization object for <code>edgeTooltipsEnabled({Boolean})</code>.</li></ul>
         */
        edgeTooltipsEnabled: function (/*enabled*/) {
            var swf = this.swf();
            if (arguments.length > 0) { swf.enableEdgeTooltips(arguments[0]); return this; }
            else { return swf.isEdgeTooltipsEnabled(); }
        },

        /**
         * <p>Pan the "camera" by the specified amount, in pixels.</p>
         * @param {Number} amountX If negative, pan left (the network moves to the right side).
         * @param {Number} amountY If negative, pan up (the network moves down).
         * @return {org.cytoscapeweb.Visualization} The Visualization instance.
         * @see org.cytoscapeweb.Visualization#panToCenter
         */
        panBy: function (amountX, amountY) {
            this.swf().panBy(amountX, amountY);
            return this;
        },

        /**
         * <p>Center the network in the canvas area.</p>
         * @return {org.cytoscapeweb.Visualization} The Visualization instance.
         * @see org.cytoscapeweb.Visualization#panBy
         */
        panToCenter: function () {
            this.swf().panToCenter();
            return this;
        },

        /**
         * <p>If the scale argument is passed, it changes the zoom level of the network.
         * Otherwise it gets the current zoom value.</p>
         * @param {Number} [scale] Value between 0 and 1.
         * @return <ul><li>A number for <code>zoom()</code>.</li>
         *             <li>The Visualization object for <code>zoom({Number})</code>.</li></ul>
         * @see org.cytoscapeweb.Visualization#zoomToFit
         */
        zoom: function (/*scale*/) {
            var swf = this.swf();
            if (arguments.length > 0) { swf.zoomTo(arguments[0]); return this; }
            else { return swf.getZoom(); }
        },

        /**
         * <p>Change the scale of the network until it fits the screen.</p>
         * <p>If the network scale is or reaches 1 (100%) and it's not cropped, it is not zoomed in to more than that.
         * It also centers the network, even if the scale was not changed.</p>
         * <p>It does not return the result scale.
         * If you want to get the applied zoom level, add an event listener before calling <code>zoomToFit</code>.</p>
         * @example
         * var scale;
         * vis.addListener("zoom", function(evt) {
         *     scale = evt.value;
         * });
         * vis.zoomToFit();
         *
         * @return {org.cytoscapeweb.Visualization} The Visualization instance.
         * @see org.cytoscapeweb.Visualization#zoom
         */
        zoomToFit: function () {
            this.swf().zoomToFit();
            return this;
        },

        /**
         * <p>Get all nodes from the network.</p>
         * @return {Array} List of nodes.
         * @see org.cytoscapeweb.Visualization#edges
         */
        nodes: function () {
            var str = this.swf().getNodes();
            return JSON.parse(str);
        },

        /**
         * <p>Get all the regular edges from the network. Merged edges are not included.</p>
         * @return {Array} List of edges.
         * @see org.cytoscapeweb.Visualization#mergedEdges
         * @see org.cytoscapeweb.Visualization#nodes
         * @see org.cytoscapeweb.Edge
         */
        edges: function () {
            var str = this.swf().getEdges();
            return JSON.parse(str);
        },
        
        /**
         * <p>Get all merged edges from the network.</p>
         * @return {Array} List of edges that have the <code>merged</code> property equals <code>true</code>.
         * @see org.cytoscapeweb.Visualization#edges
         * @see org.cytoscapeweb.Edge
         */
        mergedEdges: function () {
        	var str = this.swf().getMergedEdges();
        	return JSON.parse(str);
        },

        /**
         * <p>Select the indicated nodes and edges.</p>
         * <p>The same method can also be used to select all nodes/edges.
         * To do that, just omit the <code>items</code> argument and inform the group of elements to be selected.</p>
         * <p>If you send repeated or invalid elements, they will be ignored.</p>
         * @example
         * // a) Select nodes by id:
         * var ids = [1,3,5,10];
         * vis.select("nodes", ids);
         *
         * // b) Select one node:
         * // Notice that the group parameter ("nodes") is optional here,
         * // because it's sending a node object and not only its id.
         * var n = vis.nodes()[0];
         * vis.select([n]);
         *
         * // c) Select nodes and edges at the same time:
         * var n = vis.nodes()[0];
         * var e = vis.edges()[0];
         * vis.select([n,e]);
         *
         * // d) Select all nodes:
         * vis.select("nodes");
         * 
         * // e) Select all edges:
         * vis.select("edges");
         *
         * // f) Select all nodes and all edges:
         * vis.select();
         *
         * @param {org.cytoscapeweb.Group} [gr] The group of network elements.
         * @param {Array} [items] The items to be selected. The array can contain node/edge objects or only
         *                        their <code>id</code> values. Notice however that, if you inform only the id
         *                        and do not pass the group argument, and if an edge and a node have the same id value,
         *                        both will be selected.
         * @return {org.cytoscapeweb.Visualization} The Visualization instance.
         * @see org.cytoscapeweb.Visualization#deselect
         * @see org.cytoscapeweb.Visualization#selected
         */
        select: function (/*gr, items*/) {
        	var gr, items;
            if (arguments.length === 1) {
                if (typeof arguments[0] === "string") { gr = arguments[0]; }
                else { items = arguments[0]; }
            } else if (arguments.length > 1) {
                 gr = arguments[0];
                 items = arguments[1];
            }
            gr = this._normalizeGroup(gr);
            this.swf().select(gr, items);
            return this;
        },

        /**
         * <p>Get all selected nodes or edges from the network.</p>
         * @param {org.cytoscapeweb.Group} [gr] The group of network elements.
         * @return {Array} List of node or edge objects. If the group is not passed or is <code>null</code>,
         *                 the returned array may contain both nodes and edges.
         * @see org.cytoscapeweb.Visualization#select
         * @see org.cytoscapeweb.Visualization#deselect
         */
        selected: function (gr) {
            return this._nodesAndEdges(gr, "getSelectedNodes", "getSelectedEdges");
        },

        /**
         * <p>Deselect the indicated nodes and edges, if they are selected.</p>
         * <p>The same method can also be used to deselect all nodes/edges.
         * To do that, just omit the <code>items</code> argument and inform the group of elements to be deselected.</p>
         * <p>If you send repeated or invalid elements, they will be ignored.</p>
         * @example
         * // a) Deselect edges by id:
         * var ids = [4,6,21];
         * vis.deselect("edges", ids);
         *
         * // b) Deselect one edge only:
         * // Notice that the group parameter ("edges") is optional here,
         * // because it's sending an edge object and not only its id.
         * var e = vis.selected("edges")[0]; // assuming there is at least one selected edge!
         * vis.deselect([e]);
         *
         * // c) Deselect nodes and edges at the same time:
         * var n = vis.selected("nodes")[0];
         * var e = vis.selected("edges")[0];
         * vis.deselect([n,e]);
         *
         * // d) Deselect all nodes:
         * vis.deselect("nodes");
         * 
         * // e) Deselect all edges:
         * vis.deselect("edges");
         *
         * // f) Deselect all nodes and all edges:
         * vis.deselect();
         *
         * @param {org.cytoscapeweb.Group} [gr] The group of network elements.
         *                                      If not informed, it will try to deselect elements from both <code>node</code>
         *                                      and <code>edge</code> groups.
         * @param {Array} [items] The items to be deselected. The array can contain node/edge objects or only
         *                        their <code>id</code> values. Notice however that, if you inform only the id
         *                        and do not pass the group argument, and if an edge and a node have the same id value,
         *                        both can be deselected.<br>
         *                        If this argument is <code>null</code>, <code>undefined</code> 
         *                        or omitted, it will deselect all selected items that belong to the indicated group.<br>
         *                        If you send an empty array, no action will be performed.
         * @return {org.cytoscapeweb.Visualization} The Visualization instance.
         * @see org.cytoscapeweb.Visualization#select
         * @see org.cytoscapeweb.Visualization#selected
         */
        deselect: function (/*gr, items*/) {
            var gr, items;
            if (arguments.length === 1) {
            	if (typeof arguments[0] === "string") { gr = arguments[0]; }
            	else { items = arguments[0]; }
            } else if (arguments.length > 1) {
                gr = arguments[0];
                items = arguments[1];
            }
            gr = this._normalizeGroup(gr);
            this.swf().deselect(gr, items);
            return this;
        },

        /**
         * <p>Filter nodes or edges. The filtered out elements will be hidden.</p>
         * @example
         * // Hide all edges that have a weight that is lower than 0.4:
         * vis.filter("edges", function(edge) {
         *     return edge.data.weight >= 0.4;
         * });
         *
         * @param {org.cytoscapeweb.Group} [gr] The group of network elements to filter.
         *                                       If <code>null</code>, filter both nodes and edges.
         * @param {Function} fn The filter function. It will receive a node or edge as argument and must
         *                      return a boolean value indicating the visibility of that element.
         *                      So, if it returns false, that node or edge will be hidden.
         * @return {org.cytoscapeweb.Visualization} The Visualization instance.
         * @see org.cytoscapeweb.Visualization#removeFilter
         */
        filter: function (/*gr, */fn) {
            var gr;
            if (arguments.length > 1) { gr = arguments[0]; fn = arguments[1]; }
            gr = this._normalizeGroup(gr);
            var list = this._nodesAndEdges(gr, "getNodes", "getEdges");
            if (list.length > 0 && fn) {
                var filtered = [];
                for (var i = 0; i < list.length; i++) {
                    var obj = list[i];
                    if (fn(obj)) { filtered.push(obj); }
                }
                this.swf().filter(gr, filtered);
            }
            return this;
        },

        /**
         * <p>Remove a nodes or edges filter.</p>
         * @param {org.cytoscapeweb.Group} [gr] The group of network elements to remove the filter from.
         *                                       If <code>null</code>, remove any existing filters from both nodes and edges.
         * @return {org.cytoscapeweb.Visualization} The Visualization instance.
         * @see org.cytoscapeweb.Visualization#filter
         */
        removeFilter: function (gr) {
            gr = this._normalizeGroup(gr);
            this.swf().removeFilter(gr);
            return this;
        },

        /**
         * <p>Return the first neighbors of one or more nodes.</p>
         * @param {Array} nodes Array of node objects or node IDs.
         * @return An object that contains the following properties: 
         *         <ul><li><code>rootNodes {Array}</code>: the node objects that were passed as the function parameter.</li>
         *             <li><code>neighbors {Array}</code>: the node objects that are neighbors of the root ones.</li>
         *             <li><code>edges {Array}</code>: the edge objects that connects the root and the neighbor nodes.</li>
         *             <li><code>mergedEdges {Array}</code>: the merged edge objects that connect the returned nodes.</li></ul>.
         */
        firstNeighbors: function (nodes) {
            var str = this.swf().firstNeighbors(nodes);
            return JSON.parse(str);
        },

        /**
         * <p>Return the network data as <a href="http://graphml.graphdrawing.org/primer/graphml-primer.html" target="_blank">GraphML</a>.</p>
         * @return {String} The XML string.
         * @see org.cytoscapeweb.Visualization#xgmml
         */
        graphml: function () {
            return this.swf().getNetworkAsXml("graphml");
        },

        /**
         * <p>Return the network data as <a href="http://www.cs.rpi.edu/~puninj/XGMML/" target="_blank">XGMML</a>.</p>
         * @return {String} The XML string.
         * @see org.cytoscapeweb.Visualization#graphml
         */
        xgmml: function () {
            return this.swf().getNetworkAsXml("xgmml");
        },

        /**
         * <p>Return a PDF with the network vector image.</p>
         * @return {String} The PDF binary data encoded to a Base64 string.
         */
        pdf: function () {
            return this.swf().getNetworkAsImage("pdf");
        },
        
        /**
         * <p>Return the network as a PNG image.</p>
         * @return {String} The PNG binary data encoded to a Base64 string.
         */
        png: function () {
        	return this.swf().getNetworkAsImage("png");
        },

        /**
         * <p>Export the network to a URL.
         * It's useful when you want to download the network as an image or xml, for example.</p>
         * <p>This method requires a server-side part (e.g. Java, PHP, etc.) to receive the raw data from Cytoscape Web.
         * That server-side code should send the data back to the browser.</p>
         * @example
         * // The JavaScript code
         * vis.exportNetwork('xgmml', 'export.php?type=xml');
         * 
         * @example
         * &lt;?php
         *     # ##### The server-side code in PHP ####
         * 
         *     # Type sent as part of the URL:
         *     &#36;type = &#36;_GET['type'];
         *     # Get the raw POST data:
         *     &#36;data = file_get_contents('php://input');
         *
         *     # Set the content type accordingly:
         *     if (&#36;type == 'png') {
         *         header('Content-type: image/png');
         *     } elseif (&#36;type == 'pdf') {
         *         header('Content-type: application/pdf');
         *     } elseif (&#36;type == 'xml') {
         *         header('Content-type: text/xml');
         *     }
         * 
         *     # To force the browser to download the file:
         *     header('Content-disposition: attachment; filename="network.' . &#36;type . '"');
         *     # Send the data to the browser:
         *     print &#36;data;
         * ?&gt;
         * 
         * @param {String} format One of: <code>png</code>, <code>pdf</code>, <code>xgmml</code>, <code>graphml</code>.
         * @param {String} url The url that will receive the exported image (bytes) or xml (text).
         * @param {Object} [options] Additional options:
         *                              <ul><li><strong><code>width</code>:</strong> The desired width of the image in pixels (only for 'pdf' format).</li>
         *                                  <li><strong><code>height</code>:</strong> The desired height of the image in pixels (only for 'pdf' format).</li>
         *                                  <li><strong><code>window</code>:</strong> The browser window or HTML frame in which to display the exported image or xml.
         *                                                  You can enter the name of a specific window or use one of the following values:
         *                                                  <ul><li><code>_self</code>: the current frame in the current window.</li>
         *                                                      <li><code>_blank</code>: a new window.</li>
         *                                                      <li><code>_parent</code>: the parent of the current frame.</li>
         *                                                      <li><code>_top</code>: the top-level frame in the current window.</li></ul>
         *                                                  The default is <code>_self</code>.
         *                                                  
         * @return {org.cytoscapeweb.Visualization} The Visualization instance.
         */
        exportNetwork: function (format, url, options) {
            format = format.toLowerCase().trim();
            this.swf().exportNetwork(format, url, options);
            return this;
        },

        /**
         * <p>Appends an event listener to the network.</p>
         * <p>Listeners can be added or removed at any time, even before the graph is rendered, which means that you do not
         * need to wait for the {@link org.cytoscapeweb.Visualization#ready} function to be called.</p>
         * 
         * @example
         * // 1. Create the visualization instance:
         * var vis = new org.cytoscapeweb.Visualization("container-id");
         * 
         * // 2. Add listeners at any time:
         * vis.addListener("zoom", function(evt) {
         *     var zoom = evt.value;
         *     alert("New zoom value is " + (zoom * 100) + "%");
         * })
         * .addListener("click", "edges", function(evt) {
         *     var edge = evt.target;
         *     alert("Edge " + edge.data.id + " was clicked");
         * })
         * .addListener("select", "nodes", function(evt) {
         *     var nodes = evt.target;
         *     alert(nodes.length + " node(s) selected");
         * });
         * 
         * // 3. Draw the network:
         * vis.draw({ network: '&lt;graphml&gt;...&lt;/graphml&gt;' });
         *  
         * @param {org.cytoscapeweb.EventType} evt The event type.
         * @param {org.cytoscapeweb.Group} [gr] The group of network elements to assign the listener to (optional for some events).
         * @param {Function} fn The callback function the event invokes.
         * @return {org.cytoscapeweb.Visualization} The Visualization instance.
         * @see org.cytoscapeweb.Event
         * @see org.cytoscapeweb.Visualization#hasListener
         * @see org.cytoscapeweb.Visualization#removeListener
         */
        addListener: function (evt, /*gr, */fn) {
            var gr;
            if (arguments.length > 2) {
                gr = arguments[1];
                fn = arguments[2];
            }
            evt = this._normalizeEvent(evt);
            gr = this._normalizeGroup(gr);

            if (!this._listeners) { this._listeners = {/* group: { event: listeners[] } */}; }
            if (!this._listeners[gr]) { this._listeners[gr] = {}; }

            var fnList = this._listeners[gr][evt];
            if (!fnList) {
                fnList = [];
                this._listeners[gr][evt] = fnList;
            }
            var duplicated = false;
            for (var i = 0; i < fnList.length; i++) {
                if (fn === fnList[i]) {
                    duplicated = true;
                    break;
                }
            }
            if (!duplicated) { fnList.push(fn); }
            return this;
        },

        /**
         * <p>Removes an event listener.</p>
         * @param {org.cytoscapeweb.EventType} evt The event type.
         * @param {org.cytoscapeweb.Group} [gr] The group of network elements to assign the listener to (optional for some events).
         * @param {Function} [fn] The function the event invokes. If undefined, all registered functions
         *                        for the specified event are removed.
         * @return {org.cytoscapeweb.Visualization} The Visualization instance.
         * @see org.cytoscapeweb.Event
         * @see org.cytoscapeweb.Visualization#addListener
         * @see org.cytoscapeweb.Visualization#hasListener
         */
        removeListener: function (evt/*, gr, fn*/) {
            var gr; var fn;

            if (arguments.length > 2) {
                gr = arguments[1];
                fn = arguments[2];
            } else if (arguments.length === 2) {
                if (typeof arguments[1] === 'function') { fn = arguments[1]; }
                else { gr = arguments[1]; }
            }
            evt = this._normalizeEvent(evt);
            gr = this._normalizeGroup(gr);

            var evtList = this._listeners[gr];

            if (evtList) {
                if (!fn) {
                    // Remove all of the event's functions:
                    delete evtList[evt];
                } else {
                    // Remove only the specified function:
                    var fnList = evtList[evt];
                    if (fnList) {
                        for (var i = 0; i < fnList.length; i++) {
                            if (fn === fnList[i]) {
                                fnList.splice(i, 1);
                                break;
                            }
                        }
                    }
                }
            }
            return this;
        },

        /**
         * <p>Tells whether or not there are listeners to an event type.</p>
         * @param {org.cytoscapeweb.EventType} evt The event type.
         * @param {org.cytoscapeweb.Group} [gr] The group of network elements the listener was assigned to (optional for some events).
         * @return {Boolean} True if there is at least one listener to the event, false otherwise.
         * @see org.cytoscapeweb.Event
         * @see org.cytoscapeweb.Visualization#addListener
         * @see org.cytoscapeweb.Visualization#removeListener
         */
        hasListener: function (evt/*, gr*/) {
            var has = false;
            var gr;

            if (arguments.length > 1) { gr = arguments[1]; }
            evt = this._normalizeEvent(evt);
            gr = this._normalizeGroup(gr);

            if (this._listeners) {
                var evtList = this._listeners[gr];
                if (evtList) {
                    var fnList = evtList[evt];
                    has = fnList && fnList.length > 0;
                }
            }
            return has;
        },

        /**
         * <p>Adds a custom menu item to the right-click context menu.</p>
         * <p>This method can only be used after a network has been drawn, so it is better to use it after the
         * <code>ready</code> callback function is called (see {@link org.cytoscapeweb.Visualization#ready}).</p>
         * <p>If an item with the same label has already been set to the same group, it will not add another
         * callback function to that menu item. In that case, the previous function will be replaced by
         * the new one and only one menu item will be displayed.</p>
         * <p>It is possible to add more than one menu item with the same label, but only if they are added to
         * different groups.</p>
         * 
         * @example
         * // We will use the context menu to select the first neighbors of the
         * // right-clicked node.
         * 
         * // 1. Assuming that you have created a visualization object:
         * var vis = new org.cytoscapeweb.Visualization("container-id");
         * 
         * // 2. Add a context menu item any time after the network is ready:
         * vis.ready(function () {
         *     vis.addContextMenuItem("Select first neighbors", "nodes", 
         *         function (evt) {
         *             // Get the right-clicked node:
         *             var rootNode = evt.target;
         *         
         *             // Get the first neighbors of that node:
         *             var fNeighbors = vis.firstNeighbors([rootNode]);
         *             var neighborNodes = fNeighbors.neighbors;
         *         
         *             // Select the root node and its neighbors:
         *             vis.select([rootNode]).select(neighborNodes);
         *         }
         *     );
         * });
         * @param {String} lbl The context menu item label to be displayed.
         * @param {org.cytoscapeweb.Group} [gr] The group of network elements the menu item will be assigned to.
         *                                       If <code>"nodes"</code>, the menu item will be visible only on right-clicks
         *                                       when the cursor is over a node. If <code>"edges"</code>, only when its over an edge.
         *                                       If <code>"none"</code> or no group is provided, the menu item will be available after a right-click
         *                                       over any network element, including the canvas background.
         * @param {Function} fn The callback function that is invoked after the user selects the injected menu item.
         *                      That function always receives an event object as argument. The event type is always <code>"contextmenu"</code>.
         *                      If the context menu was added to the <code>nodes</code> or <code>edges</code> group, you might want to
         *                      get the right-clicked node or edge object by using the event's <code>target</code> property.
         * @return {org.cytoscapeweb.Visualization} The Visualization instance.
         * @see org.cytoscapeweb.Visualization#removeContextMenuItem
         * @see org.cytoscapeweb.Visualization#removeAllContextMenuItems
         */
        addContextMenuItem: function (lbl, /*gr, */fn) {
            if (lbl && fn) {
                var gr;
                if (arguments.length > 2) {
                    gr = arguments[1];
                    fn = arguments[2];
                }
                gr = this._normalizeGroup(gr);

                if (!this._contextMenuItems) {
                    this._contextMenuItems = {/* group: {label: fn} */};
                }
                var grItems = this._contextMenuItems[gr];
                if (!grItems) {
                    grItems = {};
                    this._contextMenuItems[gr] = grItems;
                }
                grItems[lbl] = fn;
                this.swf().addContextMenuItem(lbl, gr);
            }
            return this;
        },

        /**
         * <p>Removes a menu item from the right-click context menu.</p>
         * @param {String} lbl The menu item label.
         * @param {org.cytoscapeweb.Group} [gr] <p>The related group. If <code>null</code>, and there is a menu item with the same label
         *                                        associated with a <code>"nodes"</code> or <code>"edges"</code> group, that item will not be removed.
         *                                        In that case, you need to call this function again with the other groups.</p>
         *                                        </p>For example, <code>removeContextMenuItem("Select")</code> does not remove the menu item
         *                                        added with <code>addContextMenuItem("Select", "edge")</code>, but only the the one added with
         *                                        <code>addContextMenuItem("Select")</code>.<p>
         * @return {org.cytoscapeweb.Visualization} The Visualization instance.
         * @see org.cytoscapeweb.Visualization#addContextMenuItem
         * @see org.cytoscapeweb.Visualization#removeAllContextMenuItems
         */
        removeContextMenuItem: function (lbl/*, gr*/) {
            if (lbl) {
                var gr;
                if (arguments.length > 1) { gr = arguments[1]; }
                gr = this._normalizeGroup(gr);
                if (this._contextMenuItems) {
                    var grItems = this._contextMenuItems[gr];
                    if (grItems) {
                        if (grItems[lbl]) {
                            this.swf().removeContextMenuItem(lbl, gr);
                            delete grItems[lbl];
                        }
                    }
                }
            }
            return this;
        },

        /**
         * <p>Removes all preset menu items from the right-click context menu.</p>
         * @return {org.cytoscapeweb.Visualization} The Visualization instance.
         * @see org.cytoscapeweb.Visualization#addContextMenuItem
         * @see org.cytoscapeweb.Visualization#removeContextMenuItem
         */
        removeAllContextMenuItems: function () {
            if (this._contextMenuItems) {
                for (var gr in this._contextMenuItems) {
                    if (this._contextMenuItems.hasOwnProperty(gr)) {
                        var grItems = this._contextMenuItems[gr];
                        if (grItems) {
                            for (var lbl in grItems) {
                                if (grItems.hasOwnProperty(lbl)) { this.removeContextMenuItem(lbl, gr); }
                            }
                        }
                    }
                }
            }
            return this;
        },

        /**
         * <p>Get Cytoscape Web's Flash object.</p>
         * @return {Object} The appropriate reference to the Flash object.
         */
        swf: function () {
            if (navigator.appName.indexOf("Microsoft") !== -1) {
                return window[this.id];
            } else {
                return document[this.id];
            }
        },

        /**
         * <p>Redefine this function if you want to use another method to detect the Flash Player version
         * and embed the SWF file (e.g. SWFObject).</p>
         * <p>This one uses Adobe's <a href="http://www.adobe.com/products/flashplayer/download/detection_kit/" target="_blank">Flash Player Detection Kit</a>.</p>
         * @requires <code>AC_OETags.js</code> and <code>playerProductInstall.swf</code>
         */
        embedSWF: function () {
            //Major version of Flash required
            var requiredMajorVersion = 9;
            //Minor version of Flash required
            var requiredMinorVersion = 0;
            //Minor version of Flash required
            var requiredRevision = 24;

            var containerId = this.containerId;

            // Let's redefine the default AC_OETags function, because we don't necessarily want
            // to replace the whole HTML page with the swf object:
            AC_Generateobj = function (objAttrs, params, embedAttrs) {
                var str = '';
                var i;
                if (isIE && isWin && !isOpera) {
                    str += '<object ';
                    for (i in objAttrs) {
                        if (Object.hasOwnProperty.call(objAttrs, i)) {
                            str += i + '="' + objAttrs[i] + '" ';
                        }
                    }
                    str += '>';
                    for (i in params) {
                        if (Object.hasOwnProperty.call(params, i)) {
                            str += '<param name="' + i + '" value="' + params[i] + '" /> ';
                        }
                    }
                    str += '</object>';
                } else {
                    str += '<embed ';
                    for (i in embedAttrs) {
                        if (Object.hasOwnProperty.call(embedAttrs, i)) {
                            str += i + '="' + embedAttrs[i] + '" ';
                        }
                    }
                    str += '> </embed>';
                }
                // Replace only the indicated DOM element:
                document.getElementById(containerId).innerHTML = str;
            };

            // Version check for the Flash Player that has the ability to start Player Product Install (6.0r65)
            var hasProductInstall = DetectFlashVer(6, 0, 65);

            // Version check based upon the values defined in globals
            var hasRequestedVersion = DetectFlashVer(requiredMajorVersion, requiredMinorVersion, requiredRevision);

            if (hasProductInstall && !hasRequestedVersion) {
                // DO NOT MODIFY THE FOLLOWING FOUR LINES
                // Location visited after installation is complete if installation is required
                var MMPlayerType = (isIE === true) ? "ActiveX" : "PlugIn";
                var MMredirectURL = window.location;
                document.title = document.title.slice(0, 47) + " - Flash Player Installation";
                var MMdoctitle = document.title;

                AC_FL_RunContent(
                    "src", this.flashInstallerPath,
                    "FlashVars", "MMredirectURL="+MMredirectURL+'&MMplayerType='+MMPlayerType+'&MMdoctitle='+MMdoctitle+"",
                    "width", "100%",
                    "height", "100%",
                    "align", "middle",
                    "id", this.id,
                    "quality", "high",
                    "bgcolor", "#ffffff",
                    "name", this.id,
                    "allowScriptAccess","sameDomain",
                    "type", "application/x-shockwave-flash",
                    "pluginspage", "http://www.adobe.com/go/getflashplayer"
                );
            } else if (hasRequestedVersion) {
                var optionKeys = ["resourceBundleUrl"];
                var flashVars = "";
                if (this.options) {
                    for (var i in optionKeys) {
                        if (Object.hasOwnProperty.call(optionKeys, i)) {
                            var key = optionKeys[i];
                            if (this.options[key] !== undefined) {
                                flashVars += key + "=" + this.options[key] + "&";
                            }
                        }
                    }
                    flashVars += "id=" + this.id;
                }

                // if we've detected an acceptable version
                // embed the Flash Content SWF when all tests are passed
                AC_FL_RunContent(
                        "src", this.swfPath,
                        "width", "100%",
                        "height", "100%",
                        "align", "middle",
                        "id", this.id,
                        "quality", "high",
                        "bgcolor", "#ffffff",
                        "name", this.id,
                        "allowScriptAccess", "always",
                        "type", "application/x-shockwave-flash",
                        "pluginspage", "http://www.adobe.com/go/getflashplayer",
                        "wmode", "transparent",
                        "flashVars", flashVars
                );
            } else { // flash is too old or we can't detect the plugin
                // Insert non-flash content:
                document.getElementById(containerId).innerHTML = this.flashAlternateContent;
            }
            return this;
        },

        // PRIVATE METHODS:
        // -----------------------------------------------------------------------------------------

        // --------------------------------------------
        // Used by the ActionScript External Interface:
        // --------------------------------------------

        /**
         * Workaround for a problem with Internet Explorer.
         * @ignore
         */
        _onBeforeComplete: function() {
            var backup1 = window.__flash__addCallback;
            window.__flash__addCallback = function (instance, name) { try {backup1(instance, name);} catch (x){} };
            var backup2 = window.__flash__removeCallback;
            window.__flash__removeCallback = function (instance, name) { try {backup2(instance, name);} catch (x){} };
        },

        /**
         * Callback for when the Flash object is completely loaded.
         * @ignore
         */
        _onComplete: function() {
            this.swf().draw(this.drawOptions);
        },

        _onReady: function () {
            // Do nothing.
        },

        /**
         * Proxy function called by the Flash side when the object must be sent as JSON format, usually
         * to avoid compatibility problems when converting complex Flash objects to JavaScript.
         * The JSON argument is converted to an Object and the destination function is called.
         * Do NOT redefine this function!!!
         * @ignore
         */
        _dispatch: function (functionName, jsonArg) {
            var arg = null;
            if (jsonArg) { arg = JSON.parse(jsonArg); }
            var ret = this[functionName](arg);
            return ret;
        },

        /**
         * Just a proxy to hasListener.
         * @ignore
         */
        _hasListener: function (evt) {
            return this.hasListener(evt.type, evt.group);
        },

        /**
         * Invokes each listener that was registered to a given event type.
         * @ignore
         */
        _invokeListeners: function (evt) {
            if (this._listeners) {
                var gr = this._normalizeGroup(evt.group);
                var evtList = this._listeners[gr];
                if (evtList) {
                    var type = this._normalizeEvent(evt.type);
                    var fnList = evtList[type];
                    for (var i = 0; i < fnList.length; i++) {
                        fnList[i](evt);
                    }
                }
            }
        },

        /**
         * Invokes a registered context menu callback function.
         * @ignore
         */
        _invokeContextMenuCallback: function (evt) {
            if (this._contextMenuItems) {
                var gr = this._normalizeGroup(evt.group);
                var grItems = this._contextMenuItems[gr];
                if (grItems) {
                	evt = new org.cytoscapeweb.Event(evt);
                    var fn = grItems[evt.value];
                    if (fn) { fn(evt); }
                }
            }
        },

        // --------------------------------------------
        // Utility functions:
        // --------------------------------------------

        _normalizeEvent: function (evt) {
            if (evt) { evt = evt.toLowerCase().trim(); }
            return evt;
        },

        _normalizeGroup: function (gr) {
            if (gr) { gr = gr.toLowerCase().trim(); }
            if (gr !== "nodes" && gr !== "edges") { gr = "none"; }
            return gr;
        },

        _nodesAndEdges: function (gr, fnNodes, fnEdges) {
            var list = [];
            gr = this._normalizeGroup(gr);
            if (gr === "nodes" || gr === "none") {
                var nodes = JSON.parse(this.swf()[fnNodes]());
                list = list.concat(nodes);
            }
            if (gr === "edges" || gr === "none") {
                var edges = JSON.parse(this.swf()[fnEdges]());
                list = list.concat(edges);
            }
            return list;
        }
    };

    if (!String.prototype.trim) {
        String.prototype.trim = function () {
            return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g,"");
        };
    }
    
    // ===[ Events ]================================================================================

    /**
     * <p>This object represents an Event.</p>
     * <p>Events are objects passed as arguments to listeners when an event occurs.</p>
     * <p>All event objects have at least the following fields:</p>
     *    <ul><li><code>type</code></li><li><code>group</code></li></ul>
     * <p>The following tables lists the possible properties for each event type.</p>
     * <p><label><strong>click:</strong></label> Fired when the user clicks an element that belongs to the <code>group</code> you registered. 
     * If you don't specify any group or if the group is <code>none</code>, the event will be fired when the background of network visualization is clicked.</p>
     * <table>
     *     <tr><th>group</th><th>target</th><th>value</th></tr>
     *     <tr><td><code>nodes</code></td><td>{@link org.cytoscapeweb.Node}</td><td><code>undefined</code></td></tr>
     *     <tr><td><code>edges</code></td><td>{@link org.cytoscapeweb.Edge}</td><td><code>undefined</code></td></tr>
     *     <tr><td><code>none</code>: clicking the visualization background</td><td><code>undefined</code></td><td><code>undefined</code></td></tr>
     * </Table>
     * <p><label><strong>dblclick:</strong></label> Fired when the user double clicks an element that belongs to the <code>group</code> you registered. 
     * If you don't specify any group or if the group is <code>none</code>, the event will be fired when the background of network visualization is double-clicked.</p>
     * <table>
     *     <tr><th>group</th><th>target</th><th>value</th></tr>
     *     <tr><td><code>nodes</code></td><td>{@link org.cytoscapeweb.Node}</td><td><code>undefined</code></td></tr>
     *     <tr><td><code>edges</code></td><td>{@link org.cytoscapeweb.Edge}</td><td><code>undefined</code></td></tr>
     *     <tr><td><code>none</code>: double-clicking the visualization background</td><td><code>undefined</code></td><td><code>undefined</code></td></tr>
     * </Table>
     * <p><label><strong>mouseover:</strong></label> Fired when the user moves the mouse over an element that belongs to the <code>group</code> you registered. 
     * If you don't specify any group or if the group is <code>none</code>, the event will be fired any time the cursor enters the visualization rectangle.</p>
     * <table>
     *     <tr><th>group</th><th>target</th><th>value</th></tr>
     *     <tr><td><code>nodes</code></td><td>{@link org.cytoscapeweb.Node}</td><td><code>undefined</code></td></tr>
     *     <tr><td><code>edges</code></td><td>{@link org.cytoscapeweb.Edge}</td><td><code>undefined</code></td></tr>
     *     <tr><td><code>none</code>: mouse enters the visualization area</td><td><code>undefined</code></td><td><code>undefined</code></td></tr>
     * </Table>
     * <p><label><strong>mouseout:</strong></label> Fired when the user moves the mouse out of an element that belongs to the <code>group</code> you registered. 
     * If you don't specify any group or if the group is <code>none</code>, the event will be fired when the cursor leaves the visualization area.</p>
     * <table>
     *     <tr><th>group</th><th>target</th><th>value</th></tr>
     *     <tr><td><code>nodes</code></td><td>{@link org.cytoscapeweb.Node}</td><td><code>undefined</code></td></tr>
     *     <tr><td><code>edges</code></td><td>{@link org.cytoscapeweb.Edge}</td><td><code>undefined</code></td></tr>
     *     <tr><td><code>none</code>: mouse leaves the visualization area</td><td><code>undefined</code></td><td><code>undefined</code></td></tr>
     * </Table>
     * <p><label><strong>select:</strong></label> Fired when an element that belongs to the <code>group</code> you registered is selected.
     * Nodes and edges can be selected by three possible ways:
     * directly clicking it; using the drag-rectangle (the select event is dispatched only after the the mouse button is released); programmatically, with {@link org.cytoscapeweb.Visualization#select}. 
     * If you don't specify any group or if the group is <code>none</code>, the event will be fired after selecting any nodes or edges.</p>
     * <table>
     *     <tr><th>group</th><th>target</th><th>value</th></tr>
     *     <tr><td><code>nodes</code></td><td>Array of selected {@link org.cytoscapeweb.Node} objects</td><td><code>undefined</code></td></tr>
     *     <tr><td><code>edges</code></td><td>Array of selected {@link org.cytoscapeweb.Edge} objects</td><td><code>undefined</code></td></tr>
     *     <tr><td><code>none</code></td><td>Array of selected {@link org.cytoscapeweb.Node} and {@link org.cytoscapeweb.Edge} objects</td><td><code>undefined</code></td></tr>
     * </Table>
     * <p><label><strong>deselect:</strong></label> Fired when an element that belongs to the <code>group</code> you registered is deselected.
     * Nodes and edges can be deselected by the user or programmatically, with {@link org.cytoscapeweb.Visualization#deselect}. 
     * If you don't specify any group or if the group is <code>none</code>, the event will be fired after deselecting any nodes or edges.</p>
     * <table>
     *     <tr><th>group</th><th>target</th><th>value</th></tr>
     *     <tr><td><code>nodes</code></td><td>Array of deselected {@link org.cytoscapeweb.Node} objects</td><td><code>undefined</code></td></tr>
     *     <tr><td><code>edges</code></td><td>Array of deselected {@link org.cytoscapeweb.Edge} objects</td><td><code>undefined</code></td></tr>
     *     <tr><td><code>none</code></td><td>Array of deselected {@link org.cytoscapeweb.Node} and {@link org.cytoscapeweb.Edge} objects</td><td><code>undefined</code></td></tr>
     * </Table>
     * <p><label><strong>filter:</strong></label> Fired when the <code>group</code> you registered is filtered.
     * Nodes and edges can be filtered with {@link org.cytoscapeweb.Visualization#filter}.  
     * If you don't specify any group or if the group is <code>none</code>, the event will be fired after filtering nodes or edges elements.
     * It is important to be aware that if no element of the specified <code>group</code> is filtered (no filter applied), 
     * the event's <code>target</code> property will be <code>null</code>.
     * But if all the elements of that <code>group</code> is filtered out, <code>target</code> will be an empty array.</p>
     * <table>
     *     <tr><th>group</th><th>target</th><th>value</th></tr>
     *     <tr><td><code>nodes</code></td><td>Array of filtered {@link org.cytoscapeweb.Node} objects or <code>null</code></td><td><code>undefined</code></td></tr>
     *     <tr><td><code>edges</code></td><td>Array of filtered {@link org.cytoscapeweb.Edge} objects or <code>null</code></td><td><code>undefined</code></td></tr>
     *     <tr><td><code>none</code></td><td>Array of filtered {@link org.cytoscapeweb.Node} and {@link org.cytoscapeweb.Edge} objects or <code>null</code></td><td><code>undefined</code></td></tr>
     * </Table>
     * <p><label><strong>layout:</strong></label> Fired after a layout is applied (see {@link org.cytoscapeweb#layout}.</p>
     * <table>
     *     <tr><th>group</th><th>target</th><th>value</th></tr>
     *     <tr><td><code>none</code></td><td><code>undefined</code></td><td><code>The applied layout name</code></td></tr>
     * </Table>
     * <p><label><strong>visualstyle:</strong></label> Fired after a visual style is applied (see {@link org.cytoscapeweb#visualStyle}.</p>
     * <table>
     *     <tr><th>group</th><th>target</th><th>value</th></tr>
     *     <tr><td><code>none</code></td><td><code>undefined</code></td><td>The applied {@link org.cytoscapeweb.VisualStyle} object</td></tr>
     * </Table>
     * <p><label><strong>zoom:</strong></label> Fired after the network is rescaled, either by calling {@link org.cytoscapeweb#zoom} or 
     * when the user interacts with the visualization's pan-zoom control.</p>
     * <table>
     *     <tr><th>group</th><th>target</th><th>value</th></tr>
     *     <tr><td><code>none</code></td><td><code>undefined</code></td><td>The zoom value (float number from 0 to 1)</td></tr>
     * </Table>
     * <p><label><strong>error:</strong></label> Fired after the network is rescaled, either by calling {@link org.cytoscapeweb#zoom} or 
     * when the user interacts with the visualization's pan-zoom control.</p>
     * <table>
     *     <tr><th>group</th><th>target</th><th>value</th></tr>
     *     <tr><td><code>none</code></td><td><code>undefined</code></td><td>The {@link org.cytoscapeweb.Error} object</td></tr>
     * </Table>
     * <p><label><strong>contextmenu:</strong></label> Events of this type are only passed to the callback functions that are registered with {@link org.cytoscapeweb.Visualization#addContextMenuItem}.
     * You cannot add listeners to this event.</p>
     * <table>
     *     <tr><th>group</th><th>target</th><th>value</th></tr>
     *     <tr><td><code>nodes</code></td><td>The related {@link org.cytoscapeweb.Node} object</td><td><code>undefined</code></td></tr>
     *     <tr><td><code>edges</code></td><td>The related  {@link org.cytoscapeweb.Edge} object</td><td><code>undefined</code></td></tr>
     *     <tr><td><code>none</code></td><td>The {@link org.cytoscapeweb.Node} or {@link org.cytoscapeweb.Edge} object, if a node or edge was right-clicked. Or <code>undefined</code>, if the right click was done on an empty background area.</td><td><code>undefined</code></td></tr>
     * </Table>
     * 
     * @class
     * @see org.cytoscapeweb.EventType
     * @see org.cytoscapeweb.Visualization#addListener
     * @see org.cytoscapeweb.Visualization#hasListener
     * @see org.cytoscapeweb.Visualization#removeListener
     */
    this.org.cytoscapeweb.Event = function (options) {
    	/**
    	 * The event type name.
         * @type org.cytoscapeweb.EventType
         */
    	this.type = options.type;
        /**
         * The group of network elements the event is related to.
         * @type org.cytoscapeweb.Group
         */
        this.group = options.group;
        /**
         * The event target. For example, if one or more nodes are selected, the target of the 
         * <code>"select"</code> event will be an array of node objects.
         * But if a node is clicked, the target of the <code>"click"</code> event will be just a node object.
         * This property is available only for event types that are related to actions performed on nodes or edges.
         * For the other events it is <code>undefined</code>.
         * @type Object
         */
        this.target = options.target;
        /**
         * This property is a very generic one and is usually used to send back any important value that
         * is not defined as <code>target</code>. For example, for <code>"zoom"</code> events, value is
         * the new scale, but for <code>"error"</code> events it is an error object.
         */
        this.value = options.value;
    };

    // ===[ Node ]==================================================================================
     
    /**
     * <p>This object represents a Node type, but is actually just an untyped object.</p>
     * <p>So never do:</p>
     * <p><code>var node = new org.cytoscapeweb.Node(); // Wrong!!!</code></p>
     * <p>In order to create a node, just create an object with the expected fields.
     * Notice that the attribute <code>group</code> must always be <code>"nodes"</code>, 
     * because that is what really defines this type.</p>
     * @example
     * var node = {
     *     group: "nodes",
     *     shape: "TRIANGLE",
     *     size: 20,
     *     color: "0000ff",
     *     // etc...
     *     data: {
     *         id: 1
     *     }
     * };
     * @class
     * @name Node
     * @type Object
     * @memberOf org.cytoscapeweb
     */
    /**
     * The group name that defines this Data type (always <code>"nodes"</code>).
     * @property
     * @name group
     * @type org.cytoscapeweb.Group
     * @memberOf org.cytoscapeweb.Node#
     */
    /**
     * The object that stores the custom node attributes.
     * It should have at least the <code>id</code> property.
     * @property
     * @name data
     * @type Object
     * @memberOf org.cytoscapeweb.Node#
     */
    /**
      * The shape name.
      * @property
      * @name shape
      * @type org.cytoscapeweb.NodeShape
      * @memberOf org.cytoscapeweb.Node#
      */  
    /**
     * The node fill color, in hexadecimal code (e.g. <code>"#ff3333"</code>).
     * @property
     * @name color
     * @type String
     * @memberOf org.cytoscapeweb.Node#
     */
    /**
     * The node opacity, from <code>0</code> to <code>1.0</code> (100% opaque).
     * @property
     * @name opacity
     * @type Number
     * @memberOf org.cytoscapeweb.Node#
     */
    /**
     * The border color, in hexadecimal code (e.g. <code>"#000000"</code>).
     * @property
     * @name borderColor
     * @type String
     * @memberOf org.cytoscapeweb.Node#
     */    
    /**
     * The border width, in pixels.
     * @property
     * @name borderWidth
     * @type Number
     * @memberOf org.cytoscapeweb.Node#
     */ 
    /**
     * The absolute node height and width (in pixels), when the zoom level is 100%.
     * In Cytoscape Web, a node has the same value for both width and height.
     * Notice that this value is not scaled, so if you want its real visualized size, you need to multiply
     * this value by the current network scale, which is provided by {@link org.cytoscapeweb.Visualization#zoom}.
     * @property
     * @name size
     * @type Number
     * @memberOf org.cytoscapeweb.Node#
     */
    /**
     * A boolean value that indicates whether or not the node is set to visible.
     * @property
     * @name visible
     * @type Boolean
     * @memberOf org.cytoscapeweb.Node#
     */
    /**
     * The x coordinate value that indicates where the center of the node is positioned in
     * the horizontal axis of the Visualization rectangle.
     * If <code>x == 0</code>, the middle point of the node is located exactly at the left border of the network view.
     * @property
     * @name x
     * @type Number
     * @memberOf org.cytoscapeweb.Node#
     */
    /**
     * The y coordinate value that indicates where the center of the node is positioned in
     * the vertical axis of the Visualization rectangle.
     * If <code>y == 0</code>, the middle point of the node is located exactly at the top border of the network view.
     * @property
     * @name y
     * @type Number
     * @memberOf org.cytoscapeweb.Node#
     */
    
     // ===[ Edge ]=================================================================================
    
    /**
     * <p>This object represents an Edge type, but is just an untyped object.</p>
     * <p>So never do:</p>
     * <p><code>var edge = new org.cytoscapeweb.Edge(); // Wrong!!!</code></p>
     * <p>In order to create an edge, just create an object with the expected fields.
     * Notice that the attribute <code>group</code> must always be <code>"edges"</code>, 
     * because that is what really defines this type.</p>
     * @example
     * var edge = {
     *     group: "edges",
     *     merged: false,
     *     opacity: 0.8,
     *     color: "333333",
     *     width: 2,
     *     // etc...
     *     data: {
     *         id: 1,
     *         source: 1,
     *         target: 3,
     *         weight: 0.5
     *     }
     * };
     * @class
     * @name Edge
     * @memberOf org.cytoscapeweb
     * @type Object
     */
    /**
     * The group name that defines this Data type (always <code>"edges"</code>).
     * @property
     * @name group
     * @type org.cytoscapeweb.Group
     * @memberOf org.cytoscapeweb.Edge#
     */
    /**
      * The object that stores the custom edge attributes.
      * It should have at least the following properties:
      * <ul><li><code>id</code>: the edge id</li>
      *     <li><code>source</code>: the source node id</li>
      *     <li><code>target</code>: the target node id</li></ul>
      * @property
      * @name data
      * @type Object
      * @memberOf org.cytoscapeweb.Edge#
      */
    /**
      * Indicate whether or not the edge is directed. A directed edge has a default arrow pointed 
      * to the target node.
      * @property
      * @name directed
      * @type Boolean
      * @memberOf org.cytoscapeweb.Edge#
      */
    /**
     * Indicate whether or not the edge is a merged one. Merged edges are used to simplify the 
     * network visualization by just showing that two nodes are connected to each other, without 
     * displaying all the real edges that link them together.
     * @property
     * @name merged
     * @type Boolean
     * @memberOf org.cytoscapeweb.Edge#
     * @see org.cytoscapeweb.Visualization#edgesMerged
     */
    /**
     * If the edge is a merged one, this property provides the regular parallel edges that were merged together.
     * If the edge is already a regular non-merged type, this property is undefined.
     * @property
     * @name edges
     * @type Array
     * @memberOf org.cytoscapeweb.Edge#
     * @see org.cytoscapeweb.Edge#merged
     */
    /**
     * The edge opacity, from <code>0</code> to <code>1.0</code> (100% opaque).
     * @property
     * @name opacity
     * @type Number
     * @memberOf org.cytoscapeweb.Edge#
     */
    /**
     * The edge color, in hexadecimal code (e.g. <code>"#666666"</code>).
     * @property
     * @name color
     * @type String
     * @memberOf org.cytoscapeweb.Edge#
     */    
    /**
     * The edge line width, in pixels.
     * @property
     * @name width
     * @type Number
     * @memberOf org.cytoscapeweb.Edge#
     */
    /**
     * The shape name of the edge's source arrow.
     * @default <code>"NONE"</code>, unless the current visual style sets a different value.
     * @property
     * @name sourceArrowShape
     * @type org.cytoscapeweb.ArrowShape
     * @memberOf org.cytoscapeweb.Edge#
     */
    /**
     * The shape name of the edge's target arrow.
     * @default <ul><li><code>"NONE"</code>, if the edge is undirected</li>
     *              <li><code>"DELTA"</code>, if the edge is directed</li>
     * @property
     * @name targetArrowShape
     * @type org.cytoscapeweb.ArrowShape
     * @memberOf org.cytoscapeweb.Edge#
     */
    /**
     * The color code of the source arrow.
     * @property
     * @name sourceArrowColor
     * @type String
     * @memberOf org.cytoscapeweb.Edge#
     */
    /**
     * The color code of the target arrow.
     * @property
     * @name targetArrowColor
     * @type String
     * @memberOf org.cytoscapeweb.Edge#
     */
    /**
     * The value that defines the curvature rate of curved edges. Higher values create more curved edges.
     * @default 18
     * @property
     * @name curvature
     * @type Number
     * @memberOf org.cytoscapeweb.Edge#
     */
    /**
     * A boolean value that indicates whether or not the edge is set to visible.
     * @property
     * @name visible
     * @type Boolean
     * @memberOf org.cytoscapeweb.Edge#
     */
     
    // ===[ VisualStyle ]===========================================================================
    
    /**
     * <p>This object represents a Visual Style type, but it is actually just an untyped object.</p>
     * <p>A visual style may have three attributes:</p>
     * <ul><li>global</li><li>nodes</li><li>edges</li></ul>
     * <p>Each one is an object that defines a set of visual properties.</p>
     * 
     * <p>For each visual property, you can specify a default value or define a dynamic visual mapping.
     * Cytoscape Web currently supports four different types of visual mappers:</p>
     * <ul><li>continuousMapper</li><li>discreteMapper</li><li>passthroughMapper</li><li>customMapper</li></ul> 
     * 
     * <p>In order to create a visual style, just create an object with the expected fields.</p>
     * <p>Never do:</p>
     * <p><code>var style = new org.cytoscapeweb.VisualStyle(); // Wrong!!!</code></p>
     * @example
     * var style = {
     *         global: {
     *             backgroundColor: "#ffffff",
     *             tooltipDelay: 1000
     *         },
     *         nodes: {
     *             shape: "ELLIPSE",
     *             color: "#333333",
     *             opacity: 1,
     *             size: { defaultValue: 12, 
     *                     continuousMapper: { attrName: "weight", 
     *                                         minValue: 12, 
     *                                         maxValue: 36 } },
     *             borderColor: "#000000",
     *             tooltipText: "&lt;b&gt;&#36{label}&lt;/b&gt;: &#36{weight}"
     *         },
     *         edges: {
     *             color: "#999999",
     *             width: 2,
     *             mergeWidth: 2,
     *             opacity: 1,
     *             label: { passthroughMapper: { attrName: "id" } },
     *             labelFontSize: 10,
     *             labelFontWeight: "bold"
     *          }
     * };
     * @class
     * @name VisualStyle
     * @type Object
     * @memberOf org.cytoscapeweb
     * @see org.cytoscapeweb.ContinuousMapper
     * @see org.cytoscapeweb.DiscreteMapper
     * @see org.cytoscapeweb.PassthroughMapper
     * @see org.cytoscapeweb.CustomMapper
     */
    /**
     * <p>An object that defines global visual properties.</p>
     * <p>Remember that global properties do not accept visual mappers, because they cannot be associated with nodes/edges data attributes.
     * If you try to set a mapper to a global property, the mapper is simply ignored.</p>
     * <p>The possible global properties are:</p>
     * <ul><li><strong><code>backgroundColor</code></strong> {String}: Background color of the network view (hexadecimal code).
     *                                                                 The default value is "#ffffff".</li>
     *     <li><strong><code>tooltipDelay</code></strong>  {Number}: Number of milliseconds to delay before displaying the tooltip, when the cursor is over a node or edge.
     *                                                               The default value is 800 milliseconds.</li>
     *     <li><strong><code>selectionFillColor</code></strong> {String}: Fill color of the drag-selection rectangle. The default value is "#8888ff".</li>
     *     <li><strong><code>selectionLineColor</code></strong> {String}: Line color of the drag-selection border. The default value is "#8888ff".</li>
     *     <li><strong><code>selectionFillOpacity</code></strong> {Number}: Fill opacity of the drag-selection rectangle (0 to 1). The default value is 0.1.</li>
     *     <li><strong><code>selectionLineOpacity</code></strong> {Number}: Line opacity of the drag-selection border (0 to 1). The default value is 0.8.</li>
     *     <li><strong><code>selectionLineWidth</code></strong> {Number}: Line width of the drag-selection border. The default value is 1.</li></ul>
     * @property
     * @name global
     * @type Object
     * @memberOf org.cytoscapeweb.VisualStyle#
     */
    /**
     * <p>An object that defines visual styles for nodes.</p>
     * <p>The possible node properties are:</p>
     * <ul><li><strong><code>shape</code></strong> {{@link org.cytoscapeweb.NodeShape}}: Node shape name. The default value is "ELLIPSE".</li>
     *     <li><strong><code>size</code></strong> {Number}: Node size, in pixels. The default value is 24.</li>
     *     <li><strong><code>color</code></strong> {String}: Fill color code of nodes. The default value is "#f5f5f5".</li>
     *     <li><strong><code>borderColor</code></strong> {String}: Border color of nodes. The default value is "#666666".</li>
     *     <li><strong><code>borderWidth</code></strong> {Number}: Border width of nodes. The default value is 1.</li>
     *     <li><strong><code>opacity</code></strong> {Number}: The node opacity (0 to 1). The default value is 0.8.</li>
     *     <li><strong><code>selectionColor</code></strong> {String}: The fill color of selected nodes.
     *                                                                The default value is the same one set to <code>color</code>.</li>
     *     <li><strong><code>selectionBorderColor</code></strong> {String}: The border color of selected nodes.
     *                                                                      The default value is the same one set to <code>borderColor</code>.</li>
     *     <li><strong><code>selectionOpacity</code></strong> {Number}: The opacity of selected nodes (0 to 1).
     *                                                                  The default value is the same one set to <code>opacity</code>.</li>
     *     <li><strong><code>selectionBorderWidth</code></strong> {Number}: The border width of selected nodes (0 to 1).
     *                                                                      The default value is the same one set to <code>borderWidth</code>.</li>
     *     <li><strong><code>selectionGlowColor</code></strong> {String}: The glow color of selected nodes.The default value is "#ffff33".</li>
     *     <li><strong><code>selectionGlowOpacity</code></strong> {Number}: The glow transparency of selected nodes. Valid values are 0 to 1.
     *                                                                      The default value is 0.6 (60% opaque).</li>
     *     <li><strong><code>selectionGlowBlur</code></strong> {Number}: The amount of blur for the selection glow. Valid values are 0 to 255 (floating point).
     *                                                                   The default value is 8. Values that are a power of 2 (such as 2, 4, 8, 16, and 32) 
     *                                                                   are optimized to render more quickly.</li>
     *     <li><strong><code>selectionGlowStrength</code></strong> {Number}: The strength of the glow color imprint or spread when the node is selected.
     *                                                                       The higher the value, the more color is imprinted and the stronger the contrast
     *                                                                       between the glow and the background.
     *                                                                       Valid values are 0 to 255. The default is 6.</li>
     *     <li><strong><code>hoverOpacity</code></strong> {Number}: The opacity of the node when the mouse is over it (0 to 1).
     *                                                              The default value is the same one set to <code>opacity</code>.</li>
     *     <li><strong><code>hoverBorderColor</code></strong> {String}: The border color when the mouse is over a node.
     *                                                                  The default value is the same one set to <code>borderColor</code>.</li>
     *     <li><strong><code>hoverBorderWidth</code></strong> {Number}: The node border width on mouse over.
     *                                                                  The default value is the same one set to <code>borderWidth</code>.</li>
     *     <li><strong><code>hoverGlowColor</code></strong> {String}: The node glow color on mouse over.
     *                                                                The default value is "#aae6ff".</li>
     *     <li><strong><code>hoverGlowOpacity</code></strong> {Number}: The node glow opacity on mouse over (0 to 1).
     *                                                                  The default value is 0, which means that there is no visible glow on mouse over.</li>
     *     <li><strong><code>hoverGlowBlur</code></strong> {Number}: The amount of blur for the mouse over glow. Valid values are 0 to 255 (floating point).
     *                                                               The default value is 8. Values that are a power of 2 (such as 2, 4, 8, 16, and 32) 
     *                                                               are optimized to render more quickly.</li>
     *     <li><strong><code>hoverGlowStrength</code></strong> {Number}: The strength of the glow color imprint or spread on mouse over.
     *                                                                   The higher the value, the more color is imprinted and the stronger the contrast
     *                                                                   between the glow and the background.
     *                                                                   Valid values are 0 to 255. The default is 6.</li>
     *     <li><strong><code>label</code></strong> {String}: The text to be displayed as node label. A Passthrough Mapper is created by default, 
     *                                                       and it displays the node <code>data.label</code> attribute value.</li>
     *     <li><strong><code>labelFontName</code></strong> {String}: Font name of node labels. The default is "Arial".</li>
     *     <li><strong><code>labelFontSize</code></strong> {Number}: The point size of node labels. The default size is 11.</li>
     *     <li><strong><code>labelFontColor</code></strong> {String}: Font color of node labels. The default value "#000000".</li>
     *     <li><strong><code>labelFontWeight</code></strong> {String}: <code>normal</code> or <code>bold</code>. The default is "normal".</li>
     *     <li><strong><code>labelFontStyle</code></strong> {String}: <code>normal</code> or <code>italic</code>. The default is "normal".</li>
     *     <li><strong><code>labelHorizontalAnchor</code></strong> {String}: The horizontal label anchor: 
     *                                                                       <code>left</code>, <code>center</code> or <code>right</code></li>
     *     <li><strong><code>labelVerticalAnchor</code></strong> {String}: The vertical label anchor: 
     *                                                                     <code>top</code>, <code>middle</code> or <code>bottom</code></li>
     *     <li><strong><code>labelXOffset</code></strong> {Number}: Horizontal distance of the label from the node border. 
     *                                                              If <code>labelHorizontalAnchor</code> is "right",
     *                                                              the distance is measured from the left side of the node, and
     *                                                              a negative offset displaces the label towards left.</li>
     *     <li><strong><code>labelYOffset</code></strong> {Number}: Vertical distance of the label from the node border. 
     *                                                              If <code>labelVerticalAnchor</code> is "bottom", 
     *                                                              the distance is measured from the top side of the node, and
     *                                                              a negative offset moves the label upper.</li>
     *     <li><strong><code>labelGlowColor</code></strong> {String}: The color of the label glow. The default value is "#ffffff".</li>
     *     <li><strong><code>labelGlowOpacity</code></strong> {Number}: The alpha transparency of the label glow. Valid values are 0 to 1.
     *                                                                  The default value is 0 (totally transparent).</li>
     *     <li><strong><code>labelGlowBlur</code></strong> {Number}: The amount of blur for the label glow. Valid values are 0 to 255 (floating point).
     *                                                               The default value is 8. Values that are a power of 2 (such as 2, 4, 8, 16, and 32) 
     *                                                               are optimized to render more quickly.</li>
     *     <li><strong><code>labelGlowStrength</code></strong> {Number}: The strength of the imprint or spread. The higher the value, the more color 
     *                                                                   is imprinted and the stronger the contrast between the glow and the background.
     *                                                                   Valid values are 0 to 255. The default is 20.</li>
     *     <li><strong><code>tooltipText</code></strong> {String}: Static text or a text formatter for node tool tips. 
     *                                                             A list with all the node <code>data</data> attributes is displayed by default.</li>
     *     <li><strong><code>tooltipFont</code></strong> {String}: Font name of node tool tips. The default font is "Arial".</li>
     *     <li><strong><code>tooltipFontSize</code></strong> {Number}: The point size of node tool tips. The default value is 11.</li>
     *     <li><strong><code>tooltipFontColor</code></strong> {String}: Font color of node tool tips. The default value is "#000000".</li>
     *     <li><strong><code>tooltipBackgroundColor</code></strong> {String}: Background color of node tool tips. The default value is "#f5f5cc".</li>
     *     <li><strong><code>tooltipBorderColor</code></strong> {String}: Border color of node tool tips. The default value is "#000000".</li></ul>
     * @property
     * @name nodes
     * @type Object
     * @memberOf org.cytoscapeweb.VisualStyle#
     */    
    /**
     * <p>An object that defines visual styles for edges.</p>
     * <p>The possible edge properties are:</p>
     * <ul><li><strong><code>color</code></strong> {String}: Color of edges. The default value is "#999999".</li>
     *     <li><strong><code>width</code></strong> {Number}: Line width of edges. The default value is 1 pixel.</li>
     *     <li><strong><code>opacity</code></strong> {Number}: The edge opacity (0 to 1). The default value is 0.8.</li>
     *     <li><strong><code>mergeColor</code></strong> {String}: Line color for merged edges. The default value is "#666666".</li>
     *     <li><strong><code>mergeWidth</code></strong> {Number}: Line width for merged edges. The default value is 1 pixel.</li>
     *     <li><strong><code>mergeOpacity</code></strong> {Number}: Opacity of merged edges (0 to 1). The default value is 0.8.</li>
     *     <li><strong><code>selectionColor</code></strong> {String}: The fill color of selected edges.
     *                                                                The default value is the same one set to <code>color</code>
     *                                                                (or <code>mergeColor</code>, when edges are merged).</li>
     *     <li><strong><code>selectionOpacity</code></strong> {Number}: The opacity of selected edges (0 to 1).
     *                                                                  The default value is the same one set to <code>opacity</code>.</li>
     *     <li><strong><code>selectionLineWidth</code></strong> {Number}: The border width of selected edges (0 to 1).
     *                                                                    The default value is the same one set to <code>width</code>.</li>
     *     <li><strong><code>selectionGlowColor</code></strong> {String}: The glow color of selected edges.The default value is "#ffff33".</li>
     *     <li><strong><code>selectionGlowOpacity</code></strong> {Number}: The glow transparency of selected edges. Valid values are 0 to 1.
     *                                                                      The default value is 0.6 (60% opaque).</li>
     *     <li><strong><code>selectionGlowBlur</code></strong> {Number}: The amount of blur for the selection glow. Valid values are 0 to 255 (floating point).
     *                                                                   The default value is 4. Values that are a power of 2 (such as 2, 4, 8, 16, and 32) 
     *                                                                   are optimized to render more quickly.</li>
     *     <li><strong><code>selectionGlowStrength</code></strong> {Number}: The strength of the glow color imprint or spread when the edge is selected.
     *                                                                       The higher the value, the more color is imprinted and the stronger the contrast
     *                                                                       between the glow and the background.
     *                                                                       Valid values are 0 to 255. The default is 10.</li>
     *     <li><strong><code>hoverOpacity</code></strong> {Number}: The opacity of the edge when the mouse is over it (0 to 1).
     *                                                              The default value is the same one set to <code>opacity</code>.</li>
     *     <li><strong><code>curvature</code></strong> {Number}: The curvature amount of curved edges. The default value is 18.</li>
     *     <li><strong><code>sourceArrowShape</code></strong> {{@link org.cytoscapeweb.ArrowShape}}: Shape name of source arrows. The default value is "NONE".</li>
     *     <li><strong><code>targetArrowShape</code></strong> {{@link org.cytoscapeweb.ArrowShape}}: Shape name of target arrows.
     *                                                                                                For directed edges, the default value is "DELTA".
     *                                                                                                For undirected ones, the default value is "NONE".</li>
     *     <li><strong><code>sourceArrowColor</code></strong> {String}: Color code of source arrows.
     *                                                                  The default value is the same one set to the edge <code>color</code> property.</li>
     *     <li><strong><code>targetArrowColor</code></strong> {String}: Color code of target arrows.
     *                                                                  The default value is the same one set to the edge <code>color</code> property.</li>
     *     <li><strong><code>label</code></strong> {String}: The text to be displayed as edge label. There is no default value or mapper for edge labels.</li>
     *     <li><strong><code>labelFontName</code></strong> {String}: Font name of edge labels. The default is "Arial".</li>
     *     <li><strong><code>labelFontSize</code></strong> {Number}: The point size of edge labels. The default size is 11.</li>
     *     <li><strong><code>labelFontColor</code></strong> {String}: Font color of edge labels. The default value "#000000".</li>
     *     <li><strong><code>labelFontWeight</code></strong> {String}: <code>normal</code> or <code>bold</code>. The default is "normal".</li>
     *     <li><strong><code>labelFontStyle</code></strong> {String}: <code>normal</code> or <code>italic</code>. The default is "normal".</li>
     *     <li><strong><code>labelGlowColor</code></strong> {String}: The color of the label glow. The default value is "#ffffff".</li>
     *     <li><strong><code>labelGlowOpacity</code></strong> {Number}: The alpha transparency of the label glow. Valid values are 0 to 1.
     *                                                                  The default value is 0 (totally transparent).</li>
     *     <li><strong><code>labelGlowBlur</code></strong> {Number}: The amount of blur for the label glow. Valid values are 0 to 255 (floating point).
     *                                                               The default value is 2. Values that are a power of 2 (such as 2, 4, 8, 16, and 32) 
     *                                                               are optimized to render more quickly.</li>
     *     <li><strong><code>labelGlowStrength</code></strong> {Number}: The strength of the imprint or spread. The higher the value, the more color 
     *                                                                   is imprinted and the stronger the contrast between the glow and the background.
     *                                                                   Valid values are 0 to 255. The default is 20.</li>
     *     <li><strong><code>tooltipText</code></strong> {String}: Static text or a text formatter for regular edge tool tips. 
     *                                                             A list with all the edge <code>data</data> attributes is displayed by default.</li>
     *     <li><strong><code>mergeTooltipText</code></strong> {String}: Static text or a text formatter for merged edge tool tips.
     *                                                                  A list with all the merged edge <code>data</code> attributes is displayed by default.</li>
     *     <li><strong><code>tooltipFont</code></strong> {String}: Font name of edge tool tips. The default font is "Arial".</li>
     *     <li><strong><code>tooltipFontSize</code></strong> {Number}: The point size of edge tool tips. The default value is 11.</li>
     *     <li><strong><code>tooltipFontColor</code></strong> {String}: Font color of edge tool tips. The default value is "#000000".</li>
     *     <li><strong><code>tooltipBackgroundColor</code></strong> {String}: Background color of edge tool tips. The default value is "#f5f5cc".</li>
     *     <li><strong><code>tooltipBorderColor</code></strong> {String}: Border color of edge tool tips. The default value is "#000000".</li></ul>
     * @property
     * @name edges
     * @type Object
     * @memberOf org.cytoscapeweb.VisualStyle#
     */

    // ===[ Mappers ]===============================================================================
    
    /**
     * <p>This object represents a Continuous Mapper type, although it is just an untyped object.</p>
     * <p>Depending on the visual attribute, there are three kinds of continuous mappers:</p>
     * <ol><li><strong>Continuous-to-Continuous Mapper:</strong> for example, you can map a continuous numerical value to a node size.</li>
     *     <li><strong>Color Gradient Mapper:</strong> This is a special case of continuous-to-continuous mapping. 
     *         Continuous numerical values are mapped to a color gradient.</li></ol>
     * <p>* <strong>Continuous-to-Discrete</strong> mappers are not supported yet (e.g. all values below 0 are mapped to square nodes, 
     * and all values above 0 are mapped to circular nodes).</p>
     * <p>** Only numerical attributes and colors can be mapped with continuous mappers. For example,
     * there is no way to smoothly morph between circular nodes and square nodes.</p>
     * <p>*** The mapping algorithm uses a linear interpolation to calculate the values.</p>
     * @example
     * var sizeMapper = { attrName: "weight",  minValue: 12, maxValue: 36 };
     * @class
     * @name ContinuousMapper
     * @type Object
     * @memberOf org.cytoscapeweb
     * @see org.cytoscapeweb.DiscreteMapper
     * @see org.cytoscapeweb.PassthroughMapper
     * @see org.cytoscapeweb.CustomMapper
     * @see org.cytoscapeweb.VisualStyle
     */
    /**
     * <p>This object represents a Discrete Mapper type, but is just an untyped object.</p>
     * <p>Discrete network attributes are mapped to discrete visual attributes.</p>
     * <p>For example, a discrete mapper can map node colors to gene annotations.</p>
     * @example
     * // Create the mapper:
     * var colorMapper = {
     *         attrName: "molecular_function",
     *         entries: [ { attrValue: "catalytic", value: "#ff0000" },
     *                    { attrValue: "transporter", value: "#00ff00" },
     *                    { attrValue: "binding", value: "#0000ff" } ]
     * };
     * 
     * // Set the mapper to a Visual Style;
     * var style = {
     *         nodes: {
     *             color: { continuousMapper: colorMapper }
     *         }
     * };
     * 
     * // Set the new style to the Visualization:
     * vis.visualStyle(style);
     * 
     * // Now, if ( node.data["molecular_function"] == "binding" ),
     * // then the node will be blue
     * 
     * @class
     * @name DiscreteMapper
     * @type Object
     * @memberOf org.cytoscapeweb
     * @see org.cytoscapeweb.ContinuousMapper
     * @see org.cytoscapeweb.PassthroughMapper
     * @see org.cytoscapeweb.CustomMapper
     * @see org.cytoscapeweb.VisualStyle
     */
    /**
     * <p>This is an untyped object that represents a Passthrough Mapper type.</p>
     * <p>The values of network attributes are passed directly through to visual attributes.</p>
     * <p>The most common use case is using this mapper to specify node/edge labels.
     * For example, a passthrough mapper can label all nodes with their gene symbols.</p>
     * @example
     * var colorMapper = {
     *         attrName: "nodeType",
     *         entries: [ { attrValue: "typeA", value: "#ff0000" },
     *                    { attrValue: "typeB", value: "#00ff00" },
     *                    { attrValue: "typeC", value: "#0000ff" } ]
     * };
     * @class
     * @name PassthroughMapper
     * @type Object
     * @memberOf org.cytoscapeweb
     * @see org.cytoscapeweb.ContinuousMapper
     * @see org.cytoscapeweb.DiscreteMapper
     * @see org.cytoscapeweb.CustomMapper
     * @see org.cytoscapeweb.VisualStyle
     */
    /**
     * <p>This is a special type of mapper that allows you to register a callback function
     * that will be called for each associated element (nodes or edges). 
     * The function will then be responsible for returning the desired property value.</p>
     * <p>The callback function should expect a <code>data</code> object as argument.</p>
     * <p>You could, for example, use a custom mapper to create a better tooltip text.</p>
     * 
     * @example
     * // 1. First, create a function and add it to the Visualization object.
     * vis["customTooltip"] = function (data) {
     *     var value = Math.round(100 * data["weight"]) + "%";
     *     return 'The confidence level of this link is: ' +
     *            '&lt;font color="#000099" face="Courier" size="14"&gt;' + value + '&lt;/font&gt;';
     * };
     * 
     * // 2. Now create a new visual style (or get the current one) and register
     * //    the custom mapper to one or more visual properties:
     * var style = vis.visualStyle();
     * style.edges.tooltipText = { customMapper: { functionName: "customTooltip" } },
     * 
     * // 3. Finally set the visual style again:
     * vis.visualStyle(style);
     * 
     * @class
     * @name CustomMapper
     * @type Object
     * @memberOf org.cytoscapeweb
     * @see org.cytoscapeweb.ContinuousMapper
     * @see org.cytoscapeweb.DiscreteMapper
     * @see org.cytoscapeweb.PassthroughMapper
     * @see org.cytoscapeweb.VisualStyle
     */

     // ===[ Error ]================================================================================
    
    /**
     * <p>This object represents an Error type, but is just an untyped object.</p>
     * <p>It is returned by <code>"error"</code> type events.</p>
     * @class
     * @name Error
     * @memberOf org.cytoscapeweb
     * @type Object
     * @see org.cytoscapeweb.EventType
     * @see org.cytoscapeweb.Event
     * @see org.cytoscapeweb.Visualization#addListener
     */
    /**
     * The error message.
     * @property
     * @name msg
     * @type String
     * @memberOf org.cytoscapeweb.Error#
     */
    /**
     * The error id.
     * @property
     * @name id
     * @type String
     * @memberOf org.cytoscapeweb.Error#
     */
    /**
     * The error name.
     * @property
     * @name name
     * @type String
     * @memberOf org.cytoscapeweb.Error#
     */
    /**
     * The stack trace of the error.
     * @property
     * @name stackTrace
     * @type String
     * @memberOf org.cytoscapeweb.Error#
     */
    
    // ===[ Fake Enum Types ]=======================================================================
    
    /**
     * <p>This object represents a Group type. In actuality, it is a string.</p>
     * <p>However, its value must be one of:</p>
     * <ul><li><code>nodes</code></li><li><code>edges</code></li><li><code>none</code> (same as <code>null</code>)</li></ul>
     * @class
     * @name Group
     * @type String
     * @memberOf org.cytoscapeweb
     */
    /**
     * <p>This object represents an event type. In actuality, it is a string.</p>
     * <p>All of them, but <code>"contextmenu"</code> can be used with the listener methods 
     * ({@link org.cytoscapeweb.Visualization#addListener}, {@link org.cytoscapeweb.Visualization#hasListener} and
     * {@link org.cytoscapeweb.Visualization#removeListener}).</p>
     * <p>Its value must be one of:</p>
     *     <ul><li><strong><code>click</code>:</strong> For mouse click events on nodes, edges or the visualization background.</li>
     *         <li><strong><code>dblclick</code>:</strong> For double-click events on nodes, edges or the visualization background.</li>
     *         <li><strong><code>mouseover</code>:</strong> For mouse-over events on nodes, edges or the visualization background.</li>
     *         <li><strong><code>mouseout</code>:</strong> For mouse-out events on nodes, edges or the visualization background.</li>
     *         <li><strong><code>select</code>:</strong> For events dispatched after nodes or edges are selected (e.g. by direct mouse clicking or by drag-selecting).</li>
     *         <li><strong><code>deselect</code>:</strong> For events dispatched after nodes or edges are unselected.</li>
     *         <li><strong><code>filter</code>:</strong> For events dispatched after nodes or edges are filtered.</li>
     *         <li><strong><code>zoom</code>:</strong> For events dispatched after the network is rescaled.</li>
     *         <li><strong><code>layout</code>:</strong> For events dispatched after a new layout is applied or the current one is recomputed.</li>
     *         <li><strong><code>visualstyle</code>:</strong> For events dispatched after a new visual style is set.</li>
     *         <li><strong><code>contextmenu</code>:</strong> For events dispatched after a right-click context menu item is selected.
     *                                                        You cannot use this type with the listener methods (e.g. {@link org.cytoscapeweb.Visualization#addListener}).
     *                                                        Events of this type are only dispatched to the callback functions that are registered with
     *                                                        {@link org.cytoscapeweb.Visualization#addContextMenuItem}.</li>
     *         <li><strong><code>error</code>:</strong> For events dispatched when an internal error or exception occurs.</li></ul>
     * @class
     * @name EventType
     * @type String
     * @memberOf org.cytoscapeweb
     * @see org.cytoscapeweb.Visualization#addListener
     * @see org.cytoscapeweb.Visualization#hasListener
     * @see org.cytoscapeweb.Visualization#removeListener
     * @see org.cytoscapeweb.Visualization#addContextMenuItem
     */
    /**
     * <p>This object represents node shapes. In actuality, it is just a string.</p>
     * <p>Possible values:</p>
     * <ul><li><code>ELLIPSE</code></li>
     *    <li><code>RECTANGLE</code></li>
     *    <li><code>TRIANGLE</code></li>
     *    <li><code>HEXAGON</code></li>
     *    <li><code>OCTAGON</code></li>
     *    <li><code>PARALLELOGRAM</code></li>
     *    <li><code>ROUNDRECT</code></li></ul>
     * @class
     * @name NodeShape
     * @type String
     * @memberOf org.cytoscapeweb
     */
    /**
     * <p>This object represents edge arrow shapes. In actuality, it is just a string.</p>
     * <p>Its value must be one of:</p>
     * <ul><li><code>NONE</code>: indicates that there is no arrow.</li>
      *     <li><code>DELTA</code></li>
      *     <li><code>DIAMOND</code></li>
      *     <li><code>CIRCLE</code></li>
      *     <li><code>T</code></li></ul>
     * @class
     * @name ArrowShape
     * @type String
     * @memberOf org.cytoscapeweb
     */
    /**
     * <p>This object represents available network layouts. In actuality, it is just a string.</p>
     * <p>Its value must be one of:</p>
     * <ul><li><code>ForceDirected</code>
     *     <li><code>Circle</code></li>
     *     <li><code>CircleTree</code></li>
     *     <li><code>Radial</code></li>
     *     <li><code>Tree</code></li>
     *     <li><code>Preset</code>: This layout is only available when the network was loaded from an 
     *                              <a href="http://www.cs.rpi.edu/~puninj/XGMML/" target="_blank">XGMML</a> data format, whose 
     *                              <code><a href="http://www.cs.rpi.edu/~puninj/XGMML/draft-xgmml-20010628.html#NodeE" target="_blank">node</a></code>
     *                              elements contain
     *                              <code><a href="http://www.cs.rpi.edu/~puninj/XGMML/draft-xgmml-20010628.html#GraphicsA" target="_blank">graphics</a></code>
     *                              tags with defined <code>x</code> and <code>y</code> attributes. In this case, by reapplying the "Preset" layout, you can reset
     *                              the nodes position according to the original x/y values.</li></ul>
     * @class
     * @name Layout
     * @type String
     * @memberOf org.cytoscapeweb
     * @see org.cytoscapeweb.Visualization#layout
     */
})();
