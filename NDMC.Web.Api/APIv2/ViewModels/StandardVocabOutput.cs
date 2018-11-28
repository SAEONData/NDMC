using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace APIv2.ViewModels
{
    public class StandardVocabOutput
    {
        public List<StandardVocabItem> Items { get; set; }

        public StandardVocabOutput()
        {
            Items = new List<StandardVocabItem>();
        }
    }

    public class StandardVocabItem
    {
        public string Id { get; set; } //Values should be unique
        public string Value { get; set; }
        public List<StandardVocabItem> Children { get; set; }

        //Optional
        public List<KeyValuePair<string, string>> AdditionalData { get; set; }

        public StandardVocabItem()
        {
            Id = "";
            Value = "";
            Children = new List<StandardVocabItem>();
            AdditionalData = new List<KeyValuePair<string, string>>();
        }
    }
}
