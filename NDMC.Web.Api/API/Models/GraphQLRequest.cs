using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace API.Models
{
    /// <summary>
    /// GraphQL Request format as defined in specification. 
    /// Specification: http://graphql.org/learn/serving-over-http/
    /// </summary>
    public class GraphQLRequest
    {
        /// <summary>
        /// The GraphQL query as a string
        /// </summary>
        [JsonProperty("query")]
        public string query { get; set; }

        /// <summary>
        /// Operation Name - OPTIONAL : Only required if multiple operations are present in the query
        /// </summary>
        [JsonProperty("operationName")]
        public string operationName { get; set; }

        /// <summary>
        /// Variables - OPTIONAL - Additional variables that can be passed with the request
        /// </summary>
        [JsonProperty("variables")]
        public Dictionary<string, string> variables { get; set; }
    }
}