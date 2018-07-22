function Validation( items ) {
    'use strict';
    this.items  = items || {};
    this.errors = {};
    this.data = {};
    this.success = false;
}

Validation.prototype.check = function( form ) {
    'use strict';
    for ( var elem in (this.items) ) {
        if ( {}.hasOwnProperty.call(this.items, elem) ) {
            var rules = this.items[elem];
            var formElement = form[elem];
            // Is it an instance of radionodelist or not
            // As in is a radio or checkbox
            if ( 'tagName' in formElement ) {
                switch ( formElement.tagName.toLowerCase() ) {
                    case 'select':
                        this.validateSelect( elem, rules, formElement, form, this.items );
                        break;
                    case 'input':
                    case 'textarea':
                    default:
                        this.validateInput( elem, rules, formElement, form, this.items );
                        break;
                }
            } else {
                var firstNode = formElement[0]; // FormElement contains a RadioNodeList Object
                switch ( firstNode.getAttribute('type').toLowerCase() ) {
                    case 'radio':
                        this.validateRadio( elem, rules, formElement, form, this.items );
                        break;
                    case 'checkbox':
                        this.validateCheckBox( elem, rules, formElement, form, this.items );
                        break;
                }
            }
        }
    }

    if ( isEmpty(this.errors) ) {
        this.success = true;
    }

    return this;
};

// Validate provided value, if any
Validation.prototype.validateValue = function( value, elem, rules, form, items ) {
    'use strict';
    var error = false;

    if ( 'required' in rules ) {
        if ( value.length === 0 ) {
            this.errors[elem] = rules['name'] + ' is required';
            error = true;
        }
    }

    if ( (value.length !== 0) && !(error) ) {
        if ( 'min' in rules ) {
            if ( 'expected' in rules && rules['expected'].toLowerCase() === 'integer' ) {
                // Check if a valid number or integer is provided
                if ( isNaN(Number(value)) ) {
                    this.errors[elem] = rules['name'] + ' is not a valid number';
                    error = true;
                }
            }

            if ( !(error) ) {
                if ( this.checkMin(value, rules['min'], rules['expected']) ) {
                    this.errors[elem] = this.getMinMessage(
                            rules['name'], rules['min'], rules['expected']
                    );
                    error = true;
                }
            }
        }
    }

    if ( (value.length !== 0) && !(error) ) {
        if ( 'max' in rules ) {
            if ( 'expected' in rules && rules['expected'].toLowerCase() === 'integer' ) {
                // Check if a valid number or integer is provided
                if ( isNaN(Number(value)) ) {
                    this.errors[elem] = rules['name'] + ' is not a valid number';
                    error = true;
                }
            }

            if ( !(error) ) {
                if ( this.checkMax(value, rules['max'], rules['expected']) ) {
                    this.errors[elem] = this.getMaxMessage(
                            rules['name'], rules['max'], rules['expected']
                    );
                    error = true;
                }
            }
        }
    }

    if ( (value.length !== 0) && !(error) ) {
        if ( 'matches' in rules ) {
            var compareValue = form[rules['matches']].value;
            if ( value !== compareValue ) {
                var compareName = items[ rules['matches'] ];
                compareName = compareName['name'];
                this.errors[elem] = rules['name'] + ' does not match ' + compareName;
                error = true;
            }
        }
    }

    if ( (value.length !== 0) && !(error) ) {
        if ( 'email' in rules ) {
            if ( !(this.checkEmail(value)) ) {
                this.errors[elem] = rules['name'] + ' is not a valid email address';
                error = true;
            }
        }
    }

    if ( (value.length !== 0) && !(error) ) {
        if ( 'url' in rules ) {
            if ( !(this.checkUrl(value)) ) {
                this.errors[elem] = rules['name'] + ' is not a valid link';
                error = true;
            }
        }
    }

    if ( (value.length !== 0) && !(error) ) {
        if ( 'date' in rules ) {
            if ( !(this.checkDate(value)) ) {
                this.errors[elem] = rules['name'] + ' is not a valid date';
                error = true;
            }
        }
    }

    if ( (value.length !== 0) && !(error) ) {
        if ( 'permitted' in rules ) {
            if ( value.indexOf('fakepath') !== -1 && value.indexOf('\\') !== -1 ) {
                value = value.split('\\').pop();
            } else if ( value.indexOf('fakepath') !== -1 && value.indexOf('/') !== -1 ) {
                value = value.split('/').pop();
            }

            var permitted = rules['permitted'];
            var checkValue = value.split('.').pop().toLowerCase();
            if ( permitted.indexOf(checkValue) === -1 ) {
                this.errors[elem] = rules['name'] + ' is not permitted';
                error = true;
            }
        }
    }

    if ( (value.length !== 0) && !(error) ) {
        if ( 'pattern' in rules ) {
            var regex = rules['pattern'];
            if ( !(regex.test(value)) ) {
                this.errors[elem] = rules['name'] + ' is not in the required format';
                error = true;
            }
        }
    }

    // Finally, if no error add to data collection
    if ( !(error) ) {
        this.data[elem] = value;
    }
};

// Validate Select Menu
Validation.prototype.validateSelect = function( elem, rules, formElement, form, items ) {
    'use strict';
    var value = '';
    if ( formElement.hasAttribute('multiple') ) {
        value = [];
        for ( var i = 0, len = formElement.options.length; i < len; i += 1 ) {
            if ( formElement.options[i].selected ) {
                value.push( trim(formElement.options[i].value) );
            }
        }
    } else {
        value = trim( formElement.value );
    }

    this.validateValue( value, elem, rules, form, items );
};

// Validate Textarea or Input of type text, password,
// date, search, email etc
Validation.prototype.validateInput = function( elem, rules, formElement, form, items ) {
    'use strict';
    var value = '';

    if ( formElement.hasAttribute('type') ) {
        if ( formElement.getAttribute('type').toLowerCase() === 'password' ) {
            value = formElement.value;
        } else {
            value = trim( formElement.value );
        }
    } else {
        // Textarea value
        value = trim( formElement.value );
    }


    this.validateValue( value, elem, rules, form, items );
};

// Validate Radio Buttons
Validation.prototype.validateRadio = function( elem, rules, nodeList, form, items ) {
    'use strict';
    var value = '';
    for ( var i = 0, len = nodeList.length; i < len; i += 1 ) {
        if ( nodeList[i].checked ) {
            value = trim( nodeList[i].value );
            break;
        }
    }

    this.validateValue( value, elem, rules, form, items );
};

// Validate Checkboxes
Validation.prototype.validateCheckBox = function( elem, rules, nodeList, form, items ) {
    'use strict';
    var value = [];
    for ( var i = 0, len = nodeList.length; i < len; i += 1 ) {
        if ( nodeList[i].checked ) {
            value.push( trim(nodeList[i].value) );
        }
    }

    this.validateValue( value, elem, rules, form, items );
};

Validation.prototype.getMinMessage = function( name, minValue, expected ) {
    'use strict';
    expected = expected || '';
    switch ( expected.toLowerCase() ) {
        case 'integer':
            return name + ' cannot be less than ' + minValue;
        case 'string':
            return name + ' must be a minimum of ' + minValue + ' characters';
        default:
            return 'You must select at least ' + minValue + ' ' + name;
    }
};

Validation.prototype.getMaxMessage = function( name, maxValue, expected ) {
    'use strict';
    expected = expected || '';
    switch ( expected.toLowerCase() ) {
        case 'integer':
            return name + ' cannot be greater than ' + maxValue;
        case 'string':
            return name + ' must be a maximum of ' + maxValue + ' characters';
        default:
            return 'You must select a maximum of ' + maxValue + ' ' + name;
    }
};

// Check Minimum value
Validation.prototype.checkMin = function( value, minValue, expected ) {
    'use strict';
    expected = expected || '';
    switch ( expected.toLowerCase() ) {
        case 'integer':
            return Number(value) < minValue;
        case 'string':
            return String(value).length < minValue;
        default:
            return value.length < minValue;
    }
};

// Check Maximum value
Validation.prototype.checkMax = function( value, maxValue, expected ) {
    'use strict';
    expected = expected || '';
    switch ( expected.toLowerCase() ) {
        case 'integer':
            return Number(value) > maxValue;
        case 'string':
            return String(value).length > maxValue;
        default:
            return value.length > maxValue;
    }
};

// Check date value
Validation.prototype.checkDate = function( value ) {
    'use strict';
    var date = new Date( value );
    return ( isNaN(date.getDate()) ) ? false : true;
};

// Check email value
Validation.prototype.checkEmail = function( value ) {
    'use strict';
    var emailRegex = /^[\w.%+\-]+@[\w.\-]+\.[A-Za-z]{2,}$/;
    return emailRegex.test( value );
};

// Check url value
Validation.prototype.checkUrl = function( value ) {
    'use strict';
    var urlRegex = /^(http|https):\/\/[\w.\-]+(\.[\w.\-]+)+.*$/;
    return urlRegex.test( value );
};

Validation.prototype.getErrors = function() {
    'use strict';
    return this.errors;
};

Validation.prototype.getData = function() {
    'use strict';
    return this.data;
};

Validation.prototype.passed = function() {
    'use strict';
    return this.success;
};

// ^(http|https):\/\/(www\.)?facebook\.com.*$
