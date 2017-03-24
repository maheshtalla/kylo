/**
 * Defines a connection to a JDBC data source.
 *
 * @typedef {Object} JdbcDatasource
 * @property {string} [id] unique identifier for this data source
 * @property {string} name the name of this data source
 * @property {string} description a description of this data source
 * @property {Array} sourceForFeeds list of feeds using this data source
 * @property {string} type type name of this data source
 * @property {string} databaseConnectionUrl a database URL of the form jdbc:subprotocol:subname
 * @property {string} databaseDriverClassName database driver class name
 * @property {string} databaseDriverLocation comma-separated list of files/folders and/or URLs containing the driver JAR and its dependencies (if any)
 * @property {string} databaseUser database user name
 * @property {string} password password to use when connecting to this data source
 */

define(["angular", "feed-mgr/module-name"], function (angular, moduleName) {
    angular.module(moduleName).factory("DatasourcesService", ["$http", "$q", "RestUrlService", function ($http, $q, RestUrlService) {

        /**
         * Type name for JDBC data sources.
         * @type {string}
         */
        var JDBC_TYPE = "JdbcDatasource";

        /**
         * Type name for user data sources.
         * @type {string}
         */
        var USER_TYPE = "UserDatasource";

        /**
         * Interacts with the Data Sources REST API.
         * @constructor
         */
        function DatasourcesService() {
        }

        angular.extend(DatasourcesService.prototype, {
            /**
             * Deletes the data source with the specified id.
             * @param {string} id the data source id
             * @returns {Promise} for when the data source is deleted
             */
            deleteById: function (id) {
                return $http({
                    method: "DELETE",
                    url: RestUrlService.GET_DATASOURCES_URL + "/" + encodeURIComponent(id)
                });
            },

            /**
             * Filters the specified array of data sources by matching ids.
             *
             * @param {string|Array.<string>} ids the list of ids
             * @param {Array.<JdbcDatasource>} array the data sources to filter
             * @return {Array.<JdbcDatasource>} the array of matching data sources
             */
            filterArrayByIds: function (ids, array) {
                var idList = angular.isArray(ids) ? ids: [ids];
                return array.filter(function (datasource) {
                    return (idList.indexOf(datasource.id) > -1);
                });
            },

            /**
             * Finds all user data sources.
             * @returns {Promise} with the list of data sources
             */
            findAll: function () {
                return $http.get(RestUrlService.GET_DATASOURCES_URL, {params: {type: USER_TYPE}})
                    .then(function (response) {
                        return response.data;
                    });
            },

            /**
             * Finds the data source with the specified id.
             * @param {string} id the data source id
             * @returns {Promise} with the data source
             */
            findById: function (id) {
                return $http.get(RestUrlService.GET_DATASOURCES_URL + "/" + id)
                    .then(function (response) {
                        return response.data;
                    });
            },

            /**
             * Gets the ids for the specified data sources.
             *
             * @param {JdbcDatasource|Array.<JdbcDatasource>} datasources the data sources
             */
            getIds: function (datasources) {
                var array = angular.isArray(datasources) ? datasources : [datasources];
                return array.map(function (datasource) {
                    return datasource.id;
                });
            },

            /**
             * Creates a new JDBC data source.
             * @returns {JdbcDatasource} the JDBC data source
             */
            newJdbcDatasource: function () {
                return {
                    "@type": JDBC_TYPE,
                    name: "",
                    description: "",
                    sourceForFeeds: [],
                    type: "",
                    databaseConnectionUrl: "",
                    databaseDriverClassName: "",
                    databaseDriverLocation: "",
                    databaseUser: "",
                    password: ""
                };
            },

            /**
             * Saves the specified data source.
             * @param {JdbcDatasource} datasource the data source to be saved
             * @returns {Promise} with the updated data source
             */
            save: function (datasource) {
                return $http.post(RestUrlService.GET_DATASOURCES_URL, datasource)
                    .then(function (response) {
                        return response.data;
                    });
            }
        });

        return new DatasourcesService();
    }]);
});
