import { BomItem } from '../lib/bomapi';

export default function Bom({ id, bom_items }: { id: string, bom_items: BomItem[] }) {
    console.log(bom_items)
    return (
        <div className="container">
            <h1>BOM: {id}</h1>
            <table>
                <thead>
                <tr>
                    <th>Specific Part</th>
                    <th>Item Unit Cost</th>
                    <th>Quantity</th>
                    <th>Model</th>
                    <th>Updated At</th>
                    <th>Created At</th>
                </tr>
                </thead>
                <tbody>
                    {
                        bom_items.map((item) => (
                            <tr key={item.id}>
                                <td>{item.specific_part}</td>
                                <td>{item.item_unit_cost}</td>
                                <td>{item.quantity}</td>
                                <td>{item.model}</td>
                                <td>{item.updated_at}</td>
                                <td>{item.created_at}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
}