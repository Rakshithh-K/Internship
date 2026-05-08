package com.stylesphere.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "addresses")
public class Address {

    @Id
    private String id;

    private String userId;
    private String name;
    private String phone;
    private String street;
    private String city;
    private String state;
    private String pincode;
    private Boolean isDefault;
}
