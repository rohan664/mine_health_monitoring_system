'use client'
import { BreadCrumb } from 'primereact/breadcrumb';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface Item {
    label: string,
    url: string | undefined
}

export const BreadCrumbCommon = () => {
    const pathname = usePathname()
    const home = { icon: 'pi pi-home', url: 'http://localhost:3000/dashboard' };
    const [items,setItems] = useState<Item[]>([])

    useEffect(()=>{
        let paths = pathname.split("/").filter(Boolean)
        const breadcrumbItems = paths.map((element,index) => 
            ({ label: element.charAt(0).toUpperCase() + element.slice(1),
                url: index == 0 ? `/${element}`: createPath({paths,element})}
            ));
        setItems(breadcrumbItems)
    },[pathname])

    function createPath({paths,element}:{paths:Array<string>,element:string}):string {
        let url = ''
        paths.forEach((value)=>{
            if(value == element){
                url += element
                return url
            }
            url += `/${value}/`
        })
        return url
    }

    return (
        <BreadCrumb home={home} model={items} className='bg-transparent pb-4'/>
    )
}