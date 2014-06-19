/**
 * @class	ExtNodeList
 * @extends	Array.prototype
 * @param	{NodeList}	nodeList	Original NodeList (if any)
 * @author	Joseph Dalrymple <me@swivel.in>
 * @description	Acts as a NodeList that includes some extra, useful methods
 */
var ExtNodeList = (function(){
	/**
	 * Constructor Function
	 * @constructor
	 * @description	Adds elements from supplied NodeList to self
	 */
	var Constructor = function(nodeList){
		if (!nodeList) return;
		// If NodeList provided, set
		this.childNodes(nodeList);
	};

	/**
	 * Methods and Properties
	 */
	Constructor.prototype = Object.create(
		// Implement the Array Prototype
		Array.prototype || Object.getPrototypeOf(Array.prototype),

		// Enhance existing methods
		{
			/**
			 * @function
			 * @name	clone
			 * @returns	{ExtNodeList} An ENL with cloned nodes
			 */
			clone: {
				writable: false,
				configurable: false,
				enumerable: false,
				value: function() {
					// Create temporary element to get NodeList
					var tmp = document.createElement("temp");

					// Clone all containing DOM nodes
					for(var i=0;i<this.length;i++) {
						tmp.appendChild(this[i].cloneNode(true));
					}

					// Instantiate new list and return
					return new ExtNodeList(tmp.childNodes);
				}
			},


			/**
			 * @function
			 * @name	concat
			 * @returns {ExtNodeList} An ENL with the concatinated nodes
			 */
			concat: {
				writable: false,
				configurable: false,
				enumerable: false,
				value: function(arr) {
					// Create a new Extended Node List based on current list
					var ret = new ExtNodeList(this);

					// If there are more than one ENLs passed, attach them
					if (arguments.length > 1) {
						// Iterate over ENLs passed and concatinate them individually
						for (var a=0;a<arguments.length;a++) {
							ret = ret.concat(
								arguments[a]
							);
						}
					} else {
						// Iterate over elements in ENL passed
						for (var i=0;i<arr.length;i++) {
							// Push them onto the new ENL
							ret.push(arr[i]);
						}
					}

					// Return a new ENL
					return ret;
				}
			},


			/**
			 * @property	childNodes
			 * @description	IE8 Compatibility prevents use of "set" and "get" descriptors
			 */
			childNodes: {
				writable: false,
				configurable: false,
				enumerable: false,
				value: function(val) {
					// If no arguments are passed, act as a getter
					if (arguments.length<1) return this.nodeList;
					// Otherwise, act as a setter

					// Remove all nodes
					this.splice(0,this.length);

					// Set nodeList to value passed
					this.nodeList = val;

					// Iterate over nodes and push to this
					for(var i=0;i<val.length;i++) {
						this.push(val[i]);
					}

					// return original NodeList
					return val;
				}
			},


			/**
			 * @function
			 * @name appendTo
			 * @description Appends child nodes to supplied DOM node/element
			 * @returns {ExtNodeList} this
			 */
			appendTo: {
				writable: false,
				configurable: false,
				enumerable: false,
				value: function(parent) {
					// Iterate over contained nodes
					for(var i=0;i<this.length;i++) {
						// Append node to supplied DOM
						parent.appendChild(this[i]);
					}

					// return self
					return this;
				}
			},


			/**
			 * @function
			 * @name querySelectorAll
			 * @description Searches NodeList using selector query
			 * @returns {ExtNodeList} ExtNodeList with elements found
			 */
	 		querySelectorAll: {
				writable: false,
				configurable: false,
				enumerable: false,
				value: function(selector) {
					// Instantiate ExtNodeList to be returned
					var ret = new ExtNodeList();

					// Iterate over contained nodes
					for(var i=0;i<this.length;i++) {
						var elem = this[i];

						// Create temporary element
						var tmp = document.createElement('temp');

						// Append node to temporary DOM element
						tmp.appendChild(
							elem.cloneNode(false)
						);

						// Search inside tmp to see if node matches
						if (ret.indexOf(elem) < 0 && tmp.querySelectorAll(selector).length>0) {
							// Add found items to return list
							ret.push(elem);
						}

						// If node is searchable, search child nodes
						if (elem.querySelectorAll) {
							// Search node's children
							var result = elem.querySelectorAll(selector);
							for (var x=0;x<result.length;x++) {
								// Add found items to return list
								ret.push(result[x]);
							}
						}
					}

					// Return resulting ExtNodeList
					return ret;
				}
			}
		}
	);

	// Set declared Constructor to ExtNodeList var
	return Constructor;
})();