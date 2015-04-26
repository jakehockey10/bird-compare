/**
 * Created by jake on 4/25/15.
 */
/**
 * Create total based comparisons between left and right results.
 * @param left
 * @param right
 * @returns {{total: *, left: {total: *, string: string, class: *, icon: *}, right: {total: *, string: string, class: *, icon: *}}}
 */
function createTotals(left, right) {
    var leftTotal = left.length;
    var rightTotal = right.length;
    var total = leftTotal + rightTotal;
    var leftTotalString = leftTotal + ' observations';
    var rightTotalString = rightTotal + ' observations';
    var leftTotalIsBigger = leftTotal > rightTotal;
    var leftTotalEqualsRightTotal = leftTotal == rightTotal;
    var leftTotalClass;
    var rightTotalClass;
    var leftTotalIcon;
    var rightTotalIcon;
    if (leftTotalEqualsRightTotal) {
        leftTotalClass = 'info';
        rightTotalClass = 'info';
        leftTotalIcon = '';
        rightTotalIcon = '';
    } else {
        leftTotalClass = leftTotalIsBigger ? 'success' : 'danger';
        rightTotalClass = leftTotalIsBigger ? 'danger' : 'success';
        leftTotalIcon = leftTotalIsBigger ? 'fa fa-arrow-up' : 'fa fa-arrow-down';
        rightTotalIcon = leftTotalIsBigger ? 'fa fa-arrow-down' : 'fa fa-arrow-up';
    }
    return {
        total: total,
        left: {
            total: leftTotal,
            string: leftTotalString,
            class: leftTotalClass,
            icon: leftTotalIcon
        },
        right: {
            total: rightTotal,
            string: rightTotalString,
            class: rightTotalClass,
            icon: rightTotalIcon
        }
    };
}

/**
 * Create species based comparisons between left and right results.
 * @param left
 * @param right
 * @returns {{total: Number, left: {groups: (*|Dictionary<T[]>|Dictionary<TValue[]>), count: Number, class: *, icon: *}, right: {groups: (*|Dictionary<T[]>|Dictionary<TValue[]>), count: Number, class: *, icon: *}}}
 */
function createSpecies(left, right) {
    var leftSciNameGroups = _.groupBy(left, 'sciName');
    var rightSciNameGroups = _.groupBy(right, 'sciName');
    var leftSciNames = Object.keys(leftSciNameGroups);
    var rightSciNames = Object.keys(rightSciNameGroups);
    var union = _.union(leftSciNames, rightSciNames);
    var totalSpecies = union.length;
    var leftSciNameCount = leftSciNames.length;
    var rightSciNameCount = rightSciNames.length;
    var leftSpeciesCountIsBigger = leftSciNameCount > rightSciNameCount;
    var leftSpeciesCountEqualsRightSpeciesCount = leftSciNameCount == rightSciNameCount;
    var leftSpeciesClass;
    var rightSpeciesClass;
    var leftSpeciesIcon;
    var rightSpeciesIcon;
    if (leftSpeciesCountEqualsRightSpeciesCount) {
        leftSpeciesClass = 'info';
        rightSpeciesClass = 'info';
        leftSpeciesIcon = '';
        rightSpeciesIcon = '';
    } else {
        leftSpeciesClass = leftSpeciesCountIsBigger ? 'success' : 'danger';
        rightSpeciesClass = leftSpeciesCountIsBigger ? 'danger' : 'success';
        leftSpeciesIcon = leftSpeciesCountIsBigger ? 'fa fa-arrow-up' : 'fa fa-arrow-down';
        rightSpeciesIcon = leftSpeciesCountIsBigger ? 'fa fa-arrow-down' : 'fa fa-arrow-up';
    }
    return {
        total: totalSpecies,
        left: {
            groups: leftSciNameGroups,
            count: leftSciNameCount,
            class: leftSpeciesClass,
            icon: leftSpeciesIcon
        },
        right: {
            groups: rightSciNameGroups,
            count: rightSciNameCount,
            class: rightSpeciesClass,
            icon: rightSpeciesIcon
        }
    };
}

/**
 * Create location based comparisons between left and right results.
 * @param left
 * @param right
 * @returns {{left: {amount: Number, most: (T|*), amountClass: *, amountIcon: *, mostClass: *, mostIcon: *}, right: {amount: Number, most: (T|*), amountClass: *, amountIcon: *, mostClass: *, mostIcon: *}}}
 */
function createLocations(left, right) {
    var leftLocNames = _.groupBy(left, 'locName');
    var rightLocNames = _.groupBy(right, 'locName');
    leftLocNames = _.mapValues(leftLocNames, function (name) {
        var total = 0;
        name.forEach(function (observation) {
            // TODO: make sure to check whether this should be 0 or 1 if the object doesn't contain howMany key.
            total += observation.howMany || 0;
        });
        name.total = total;
        return name;
    });
    rightLocNames = _.mapValues(rightLocNames, function (name) {
        var total = 0;
        name.forEach(function (observation) {
            // TODO: make sure to check whether this should be 0 or 1 if the object doesn't contain howMany key.
            total += observation.howMany || 0;
        });
        name.total = total;
        return name;
    });
    var leftLocAmount = Object.keys(leftLocNames).length;
    var rightLocAmount = Object.keys(rightLocNames).length;
    var leftNameMaxObs = _.max(leftLocNames, function (name) {
        return name.total;
    });
    var rightNameMaxObs = _.max(rightLocNames, function (name) {
        return name.total;
    });
    var leftLocAmountIsBigger = leftLocAmount > rightLocAmount;
    var leftLocAmountEqualsRightLocAmount = leftLocAmount == rightLocAmount;
    var leftLocAmountClass;
    var rightLocAmountClass;
    var leftLocAmountIcon;
    var rightLocAmountIcon;
    if (leftLocAmountEqualsRightLocAmount) {
        leftLocAmountClass = 'info';
        rightLocAmountClass = 'info';
        leftLocAmountIcon = '';
        rightLocAmountIcon = '';
    } else {
        leftLocAmountClass = leftLocAmountIsBigger ? 'success' : 'danger';
        rightLocAmountClass = leftLocAmountIsBigger ? 'danger' : 'success';
        leftLocAmountIcon = leftLocAmountIsBigger ? 'fa fa-arrow-up' : 'fa fa-arrow-down';
        rightLocAmountIcon = leftLocAmountIsBigger ? 'fa fa-arrow-down' : 'fa fa-arrow-up';
    }
    var leftLocMostIsBigger = leftNameMaxObs.total > rightNameMaxObs.total;
    var leftLocMostEqualsRightLocMost = leftNameMaxObs.total == rightNameMaxObs.total;
    var leftLocMostClass;
    var rightLocMostClass;
    var leftLocMostIcon;
    var rightLocMostIcon;
    if (leftLocMostEqualsRightLocMost) {
        leftLocMostClass = 'info';
        rightLocMostClass = 'info';
        leftLocMostIcon = '';
        rightLocMostIcon = '';
    } else {
        leftLocMostClass = leftLocMostIsBigger ? 'success' : 'danger';
        rightLocMostClass = leftLocMostIsBigger ? 'danger' : 'success';
        leftLocMostIcon = leftLocMostIsBigger ? 'fa fa-arrow-up' : 'fa fa-arrow-down';
        rightLocMostIcon = leftLocMostIsBigger ? 'fa fa-arrow-down' : 'fa fa-arrow-up';
    }
    return {
        left: {
            amount: leftLocAmount,
            most: leftNameMaxObs,
            amountClass: leftLocAmountClass,
            amountIcon: leftLocAmountIcon,
            mostClass: leftLocMostClass,
            mostIcon: leftLocMostIcon
        },
        right: {
            amount: rightLocAmount,
            most: rightNameMaxObs,
            amountClass: rightLocAmountClass,
            amountIcon: rightLocAmountIcon,
            mostClass: rightLocMostClass,
            mostIcon: rightLocMostIcon
        }
    };
}

/**
 * Comparison Class to change the results of eBird endpoint results
 */

var Comparison = function (left, right) {
    var totals = createTotals(left, right);
    var species = createSpecies(left, right);
    var locations = createLocations(left, right);

    return {
        total: totals.total,
        totalSpecies: species.total,
        left: {
            total: {
                amount: totals.left.total,
                string: totals.left.string,
                class: totals.left.class,
                icon: totals.left.icon
            },
            species: {
                groups: species.left.groups,
                amount: species.left.count,
                class: species.left.class,
                icon: species.left.icon
            },
            locations: {
                amount: locations.left.amount,
                most: locations.left.most,
                amountClass: locations.left.amountClass,
                amountIcon: locations.left.amountIcon,
                mostClass: locations.left.mostClass,
                mostIcon: locations.left.mostIcon
            }
        },
        right: {
            total: {
                amount: totals.right.total,
                string: totals.right.string,
                class: totals.right.class,
                icon: totals.right.icon
            },
            species: {
                groups: species.right.groups,
                amount: species.right.count,
                class: species.right.class,
                icon: species.right.icon
            },
            locations: {
                amount: locations.right.amount,
                most: locations.right.most,
                amountClass: locations.right.amountClass,
                amountIcon: locations.right.amountIcon,
                mostClass: locations.right.mostClass,
                mostIcon: locations.right.mostIcon
            }
        }
    };
};
