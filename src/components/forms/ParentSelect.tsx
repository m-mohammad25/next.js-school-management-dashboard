import AsyncSelect from "react-select/async";
import { Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { debounce } from "lodash";

type ParentOption = {
  value: string;
  label: string;
};

export default function ParentSelect({
  control,
  defaultValue,
}: {
  control: any;
  defaultValue?: string;
}) {
  const [selectedOption, setSelectedOption] = useState<ParentOption | null>(
    null
  );

  // Fetch parent details if a defaultValue (id) exists
  useEffect(() => {
    if (defaultValue) {
      (async () => {
        const res = await fetch(`/api/parents?id=${defaultValue}`);
        const parent = await res.json();
        setSelectedOption({
          value: parent.id,
          label: `${parent.name} ${parent.surname} (${
            parent.email || parent.phone
          })`,
        });
      })();
    }
  }, [defaultValue]);

  const loadOptions = debounce(
    async (inputValue: string): Promise<ParentOption[]> => {
      const res = await fetch(`/api/parents?search=${inputValue}`);
      const data = await res.json();
      return data.map((p: any) => ({
        value: p.id,
        label: `${p.name} ${p.surname} (${p.email || p.phone})`,
      }));
    },
    1000 * 0.5
  );

  return (
    <Controller
      name="parentId"
      control={control}
      defaultValue={defaultValue || ""}
      render={({ field }) => (
        <AsyncSelect
          className="text-sm w-full"
          cacheOptions
          defaultOptions
          loadOptions={loadOptions}
          value={selectedOption || null} // controlled value
          onChange={(selected) => {
            field.onChange(selected?.value);
            setSelectedOption(selected as ParentOption);
          }}
          placeholder="Search and select a parent..."
        />
      )}
    />
  );
}
