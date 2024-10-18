import { categories } from "@/lib/models";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
const CategorySelect = (props: {setCategory: any}) => {

            return <Select
              onValueChange={(selectVal: string) => {
                props.setCategory(selectVal.trim());
                console.log(selectVal.trim());
              }}
              required
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {
                  categories.map((ctg: string) => {
                    return <SelectItem key={"select-category-item" + ctg} value={ctg}>{ctg.charAt(0).toUpperCase() + ctg.slice(1)}</SelectItem>
                  })
                }
              </SelectContent>
            </Select>
}

export default CategorySelect;
